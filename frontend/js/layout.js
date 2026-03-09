const navItems = [
  { page: "dashboard", label: "Dashboard", href: "dashboard.html" },
  { page: "students", label: "Students", href: "students.html" },
  { page: "analytics", label: "Analytics", href: "analytics.html" },
  { page: "subjects", label: "Subjects", href: "subjects.html" },
  { page: "leaderboard", label: "Leaderboard", href: "leaderboard.html" },
  { page: "profile", label: "Profile", href: "profile.html" },
  { page: "upload", label: "Upload Marks", href: "upload.html" },
  { page: "reports", label: "Reports", href: "reports.html" }
];

const pageTitles = {
  dashboard: { title: "Admin Dashboard", subtitle: "Performance summary across all academic units." },
  students: { title: "Student Performance Analytics", subtitle: "Filter and inspect student-level outcomes." },
  analytics: { title: "Performance Analytics", subtitle: "Track academic trends over time." },
  subjects: { title: "Subject-wise Performance", subtitle: "Compare score strength by subject." },
  leaderboard: { title: "Top Students Leaderboard", subtitle: "Recognize high performers with ranking insights." },
  profile: { title: "Student Profile", subtitle: "Detailed profile and performance trend." },
  upload: { title: "Upload Marks", subtitle: "Submit score data safely to backend endpoints." },
  reports: { title: "Reports & Export", subtitle: "Generate downloadable reports for stakeholders." }
};

export function renderLayout(page) {
  const sidebar = document.querySelector("#sidebar");
  const header = document.querySelector("#topbar");
  if (!sidebar || !header) return;

  sidebar.className = "sidebar";
  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-badge">AA</div>
      <div>
        <div>Academy Analysis</div>
        <small class="helper">Academic Intelligence</small>
      </div>
    </div>
    <nav class="nav-group">
      ${navItems
        .map(
          (item) => `
        <a class="nav-link ${item.page === page ? "active" : ""}" href="${item.href}">
          <span>${item.label}</span>
        </a>`
        )
        .join("")}
    </nav>
  `;

  const activePage = pageTitles[page] || pageTitles.dashboard;
  header.className = "topbar";
  header.innerHTML = `
    <div class="title">
      <h1>${activePage.title}</h1>
      <p>${activePage.subtitle}</p>
    </div>
    <div class="actions">
      <button id="themeToggle" class="btn">Toggle Theme</button>
      <a class="btn primary" href="reports.html">Export Data</a>
    </div>
  `;
}
