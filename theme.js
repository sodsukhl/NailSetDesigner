// =============================================================
// theme.js — light / dark mode
// Loaded in the <head> so the page never flashes the wrong theme.
// Starts with the visitor's system setting, then remembers their choice
// in this browser.
// =============================================================
(function () {
  const KEY = "nsd-theme";
  const root = document.documentElement;

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked: use system setting */ }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved || (prefersDark ? "dark" : "light");

  // Hook up the switch once the page has loaded
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    const sync = () => toggle.setAttribute("aria-checked", root.dataset.theme === "dark");
    sync();
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, root.dataset.theme); } catch (e) { /* not saved, still switches */ }
      sync();
    });
  });
})();
