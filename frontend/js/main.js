import { renderLayout } from "./layout.js";
import { initTheme, wireThemeToggle } from "./theme.js";
import { initGlobalErrorReporting, reportFrontendError } from "./error-reporter.js";
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
initGlobalErrorReporting();

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
  try {
    handlers[page]();
  } catch (error) {
    reportFrontendError(error, { page, type: "page-init" });
    throw error;
  }
}
