import { reportFrontendError } from "./error-reporter.js";

const headers = {
  "Content-Type": "application/json"
};

async function request(url, options = {}) {
  const method = options.method || "GET";

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) }
    });

    if (!response.ok) {
      const error = new Error(`API error ${response.status}: ${response.statusText}`);
      await reportFrontendError(error, {
        type: "api-response",
        endpoint: url,
        method,
        status: response.status,
        statusText: response.statusText
      });
      error.frontendReported = true;
      throw error;
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    if (!error.frontendReported) {
      await reportFrontendError(error, {
        type: "api-request",
        endpoint: url,
        method
      });
    }
    throw error;
  }
}

export function fetchDashboardSummary() {
  return request("/api/dashboard/summary");
}

export function fetchStudents(params = "") {
  return request(`/api/students${params ? `?${params}` : ""}`);
}

export function fetchSubjectPerformance() {
  return request("/api/performance/subjects");
}

export function uploadMarks(payload) {
  return request("/api/marks/upload", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function exportReport(format = "csv") {
  return request(`/api/reports/export?format=${format}`);
}
