import { renderLayout } from "./layout.js";
import { initTheme, wireThemeToggle } from "./theme.js";
import {
  initDashboard,
  initStudents,
  initAnalytics,
  initSubjects,
  initLeaderboard,
  initProfile,
  initUpload,
  initReports
} from "./pages.js";

initTheme();

const page = document.body.dataset.page;
if (page && page !== "login") {
  renderLayout(page);
  wireThemeToggle();
}

const handlers = {
  dashboard: initDashboard,
  students: initStudents,
  analytics: initAnalytics,
  subjects: initSubjects,
  leaderboard: initLeaderboard,
  profile: initProfile,
  upload: initUpload,
  reports: initReports
};

if (handlers[page]) {
  handlers[page]();
}
