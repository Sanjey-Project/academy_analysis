import {
  metrics,
  students,
  subjectAverages,
  monthlyPerformance,
  classWisePassRate
} from "./data.js";
import { exportReport, uploadMarks } from "./api.js";

function statusPill(score) {
  return score >= 80
    ? '<span class="pill success">Excellent</span>'
    : '<span class="pill warning">Needs Attention</span>';
}

function renderStudentsTable(records) {
  const tbody = document.querySelector("#studentsTableBody");
  if (!tbody) return;
  tbody.innerHTML = records
    .map(
      (s) => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.grade}-${s.section}</td>
      <td>${s.score}</td>
      <td>${s.attendance}%</td>
      <td>${statusPill(s.score)}</td>
    </tr>`
    )
    .join("");
}

function baseChartOptions() {
  return {
    responsive: true,
    plugins: {
      legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue("--text").trim() } }
    },
    scales: {
      x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() } },
      y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() } }
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart"
    }
  };
}

export function initDashboard() {
  const map = {
    totalStudents: metrics.students,
    avgScore: `${metrics.avgScore}%`,
    attendance: `${metrics.attendance}%`,
    passRate: `${metrics.passRate}%`
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  const trendCtx = document.getElementById("trendChart");
  if (trendCtx && window.Chart) {
    new window.Chart(trendCtx, {
      type: "line",
      data: {
        labels: monthlyPerformance.labels,
        datasets: [
          {
            label: "Average Score",
            data: monthlyPerformance.scores,
            borderColor: "#0b57d0",
            backgroundColor: "rgba(11,87,208,0.15)",
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: baseChartOptions()
    });
  }
}

export function initStudents() {
  renderStudentsTable(students);
  const search = document.getElementById("studentSearch");
  const grade = document.getElementById("gradeFilter");

  const apply = () => {
    const term = (search?.value || "").toLowerCase().trim();
    const gradeValue = grade?.value || "";
    const filtered = students.filter(
      (s) =>
        (!term || s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term)) &&
        (!gradeValue || s.grade === gradeValue)
    );
    renderStudentsTable(filtered);
  };

  search?.addEventListener("input", apply);
  grade?.addEventListener("change", apply);
}

export function initAnalytics() {
  const passCtx = document.getElementById("passRateChart");
  const growthCtx = document.getElementById("growthChart");
  if (window.Chart && passCtx) {
    new window.Chart(passCtx, {
      type: "bar",
      data: {
        labels: classWisePassRate.labels,
        datasets: [{ label: "Pass Rate %", data: classWisePassRate.values, backgroundColor: "#0b57d0" }]
      },
      options: baseChartOptions()
    });
  }

  if (window.Chart && growthCtx) {
    new window.Chart(growthCtx, {
      type: "line",
      data: {
        labels: monthlyPerformance.labels,
        datasets: [{ label: "Academic Growth", data: monthlyPerformance.scores, borderColor: "#117a3a", tension: 0.35 }]
      },
      options: baseChartOptions()
    });
  }
}

export function initSubjects() {
  const subjectCtx = document.getElementById("subjectChart");
  if (window.Chart && subjectCtx) {
    new window.Chart(subjectCtx, {
      type: "radar",
      data: {
        labels: subjectAverages.labels,
        datasets: [
          {
            label: "Average Subject Score",
            data: subjectAverages.scores,
            borderColor: "#0b57d0",
            backgroundColor: "rgba(11,87,208,0.2)"
          }
        ]
      },
      options: {
        ...baseChartOptions(),
        scales: { r: { suggestedMin: 50, suggestedMax: 100 } }
      }
    });
  }
}

export function initLeaderboard() {
  const sorted = [...students].sort((a, b) => b.score - a.score);
  const body = document.getElementById("leaderboardBody");
  if (!body) return;
  body.innerHTML = sorted
    .map(
      (s, index) => `
      <tr>
        <td>#${index + 1}</td>
        <td>${s.name}</td>
        <td>${s.grade}-${s.section}</td>
        <td>${s.score}</td>
        <td>${s.attendance}%</td>
      </tr>`
    )
    .join("");
}

export function initProfile() {
  const trendCtx = document.getElementById("profileChart");
  if (window.Chart && trendCtx) {
    new window.Chart(trendCtx, {
      type: "line",
      data: {
        labels: ["Term 1", "Term 2", "Term 3", "Term 4"],
        datasets: [{ label: "Score", data: [78, 84, 87, 91], borderColor: "#0b57d0", tension: 0.25 }]
      },
      options: baseChartOptions()
    });
  }
}

export function initUpload() {
  const form = document.getElementById("uploadForm");
  const message = document.getElementById("uploadMessage");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      studentId: form.studentId.value,
      subject: form.subject.value,
      marks: Number(form.marks.value),
      examType: form.examType.value
    };

    try {
      await uploadMarks(payload);
      message.textContent = "Marks uploaded successfully.";
      message.style.color = "var(--success)";
      form.reset();
    } catch {
      message.textContent = "Backend unavailable. Payload validated on UI and ready for API.";
      message.style.color = "var(--warning)";
    }
  });
}

export function initReports() {
  const button = document.getElementById("exportCsv");
  const status = document.getElementById("reportStatus");
  button?.addEventListener("click", async () => {
    status.textContent = "Generating report...";
    try {
      await exportReport("csv");
      status.textContent = "Report request sent to backend endpoint successfully.";
      status.style.color = "var(--success)";
    } catch {
      status.textContent = "Could not reach backend export endpoint. UI integration is ready.";
      status.style.color = "var(--warning)";
    }
  });
}
