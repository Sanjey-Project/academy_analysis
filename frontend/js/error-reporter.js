const GOOGLE_CHAT_WEBHOOK_URL =
  "https://chat.googleapis.com/v1/spaces/AAQAGYcinA8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=WfmqI-o5quA7VT12vPHIHzqze1fBQS0sUuXk_45vud0";

const MAX_MESSAGE_LENGTH = 3500;
let initialized = false;

function trim(value) {
  if (!value) return "N/A";
  return String(value).slice(0, MAX_MESSAGE_LENGTH);
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
    message: trim(typeof errorLike === "string" ? errorLike : JSON.stringify(errorLike)),
    stack: "N/A"
  };
}

function buildCardMessage(details, context = {}) {
  const lines = [
    "*Frontend Error Alert*",
    `Page: ${trim(window.location.href)}`,
    `Error: ${trim(details.name)}`,
    `Message: ${trim(details.message)}`,
    `Stack: ${trim(details.stack)}`,
    `Context: ${trim(Object.keys(context).length ? JSON.stringify(context) : "N/A")}`,
    `Time: ${new Date().toISOString()}`,
    `User Agent: ${trim(navigator.userAgent)}`
  ];

  return { text: lines.join("\n") };
}

export async function reportFrontendError(errorLike, context = {}) {
  const details = formatErrorDetails(errorLike);

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
