import { initTheme } from "./theme.js";

initTheme();

const form = document.getElementById("loginForm");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  window.location.href = "dashboard.html";
});
