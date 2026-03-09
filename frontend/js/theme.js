const KEY = "academy-theme";

export function initTheme() {
  const saved = localStorage.getItem(KEY);
  const theme = saved || "light";
  document.documentElement.setAttribute("data-theme", theme);
}

export function wireThemeToggle() {
  const btn = document.querySelector("#themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
  });
}
