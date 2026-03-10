const GOOGLE_CHAT_WEBHOOK_URL =
  "https://chat.googleapis.com/v1/spaces/AAQAGYcinA8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=WfmqI-o5quA7VT12vPHIHzqze1fBQS0sUuXk_45vud0";

const MAX_MESSAGE_LENGTH = 3500;
const DEDUPE_WINDOW_MS = 5000;
let initialized = false;
const recentlySentErrors = new Map();

function trim(value) {
  if (!value) return "N/A";
  return String(value).slice(0, MAX_MESSAGE_LENGTH);
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return "Unserializable context";
  }
}

function formatErrorDetails(errorLike) {
  if (!errorLike) {
    return { name: "UnknownError", message: "Unknown frontend error", stack: "N/A" };
  }

  if (errorLike instanceof Error) {
    return {
      name: errorLike.name || "Error",
      message: errorLike.message || "Error without message",
      stack: trim(errorLike.stack)
    };
  }

  return {
    name: "NonErrorRejection",
    message: trim(typeof errorLike === "string" ? errorLike : safeJson(errorLike)),
    stack: "N/A"
  };
}

function buildMetadata(context = {}) {
  return {
    theme: document.documentElement.getAttribute("data-theme") || "light",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    online: navigator.onLine,
    language: navigator.language || "N/A",
    referrer: document.referrer || "N/A",
    page: document.body?.dataset?.page || "unknown",
    ...context
  };
}

function shouldSkipDuplicate(details, context) {
  const fingerprint = `${details.name}|${details.message}|${safeJson(context)}`;
  const now = Date.now();
  const lastSentAt = recentlySentErrors.get(fingerprint);

  if (lastSentAt && now - lastSentAt < DEDUPE_WINDOW_MS) {
    return true;
  }

  recentlySentErrors.set(fingerprint, now);
  return false;
}

function buildCardMessage(details, context = {}) {
  const metadata = buildMetadata(context);
  const lines = [
    "*Frontend Error Alert*",
    `Page: ${trim(window.location.href)}`,
    `Error: ${trim(details.name)}`,
    `Message: ${trim(details.message)}`,
    `Stack: ${trim(details.stack)}`,
    `Context: ${trim(Object.keys(metadata).length ? safeJson(metadata) : "N/A")}`,
    `Time: ${new Date().toISOString()}`,
    `User Agent: ${trim(navigator.userAgent)}`
  ];

  return { text: lines.join("\n") };
}

export async function reportFrontendError(errorLike, context = {}) {
  const details = formatErrorDetails(errorLike);
  if (shouldSkipDuplicate(details, context)) return;

  try {
    await fetch(GOOGLE_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildCardMessage(details, context))
    });
  } catch (reportingError) {
    console.error("Failed to send frontend error to Google Chat.", reportingError);
  }
}

export async function reportHandledError(message, context = {}) {
  return reportFrontendError(new Error(message), {
    severity: "handled",
    ...context
  });
}

export function initGlobalErrorReporting() {
  if (initialized) return;
  initialized = true;

  window.addEventListener("error", (event) => {
    reportFrontendError(event.error || new Error(event.message), {
      source: event.filename || "N/A",
      line: event.lineno || "N/A",
      column: event.colno || "N/A",
      type: "window.error"
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportFrontendError(event.reason, {
      type: "window.unhandledrejection"
    });
  });
}
