const headers = {
  "Content-Type": "application/json"
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) return null;
  return response.json();
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
