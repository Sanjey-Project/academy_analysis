import { initTheme } from "./theme.js";
import { initGlobalErrorReporting, reportFrontendError } from "./error-reporter.js";

initTheme();
initGlobalErrorReporting();

const form = document.getElementById("loginForm");
form?.addEventListener("submit", (event) => {
  try {
    event.preventDefault();
    window.location.href = "dashboard.html";
  } catch (error) {
    reportFrontendError(error, { page: "login", type: "login-submit" });
    throw error;
  }
});
