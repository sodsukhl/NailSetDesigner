// =============================================================
// popup.js — a pop-up that matches the site (instead of the
// browser's grey confirm box). Used by Reset and Delete.
//
// How to use it:
//   const ok = await showPopup({
//     title: "Reset your set?",
//     message: "All nails go back to the starting look.",
//     confirmText: "Reset",
//   });
//   if (ok) { ...do the thing... }
// =============================================================
(function () {
  // Build the pop-up once and add it to the page
  const dialog = document.createElement("dialog");
  dialog.className = "popup";
  dialog.innerHTML = `
    <h2 class="popup-title"></h2>
    <p class="popup-message"></p>
    <div class="popup-actions">
      <button type="button" class="pill popup-cancel">Cancel</button>
      <button type="button" class="popup-confirm"></button>
    </div>`;
  document.body.appendChild(dialog);

  const titleEl = dialog.querySelector(".popup-title");
  const messageEl = dialog.querySelector(".popup-message");
  const cancelBtn = dialog.querySelector(".popup-cancel");
  const confirmBtn = dialog.querySelector(".popup-confirm");

  window.showPopup = function ({ title, message, confirmText = "OK", danger = false }) {
    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmBtn.textContent = confirmText;
    confirmBtn.classList.toggle("danger", danger);

    return new Promise((resolve) => {
      function close(result) {
        dialog.close();
        cancelBtn.removeEventListener("click", onCancel);
        confirmBtn.removeEventListener("click", onConfirm);
        dialog.removeEventListener("cancel", onCancel);
        dialog.removeEventListener("click", onBackdrop);
        resolve(result);
      }
      const onCancel = (e) => { e.preventDefault(); close(false); }; // Cancel button or Esc key
      const onConfirm = () => close(true);
      const onBackdrop = (e) => { if (e.target === dialog) close(false); }; // click outside the box

      cancelBtn.addEventListener("click", onCancel);
      confirmBtn.addEventListener("click", onConfirm);
      dialog.addEventListener("cancel", onCancel);
      dialog.addEventListener("click", onBackdrop);

      dialog.showModal();
      cancelBtn.focus(); // the safe choice is selected first
    });
  };
})();
