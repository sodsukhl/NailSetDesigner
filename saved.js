// =============================================================
// saved.js — the Saved Designs page
// READ all designs from the API, and DELETE a design.
// =============================================================
const grid = document.getElementById("designs");
const statusText = document.getElementById("status");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

async function loadDesigns() {
  try {
    const res = await fetch("/api/sets");
    if (!res.ok) throw new Error("Could not load your designs");
    const designs = await res.json();

    grid.innerHTML = "";
    if (!designs.length) {
      statusText.textContent = "";
      grid.innerHTML = `<div class="card empty">No saved designs yet. <a href="index.html">Create your first set</a></div>`;
      return;
    }
    statusText.textContent = `${designs.length} saved design${designs.length === 1 ? "" : "s"}`;

    designs.forEach((d) => {
      const card = document.createElement("article");
      card.className = "card design-card";
      card.innerHTML = `
        <svg aria-hidden="true"></svg>
        <h3></h3>
        <p class="meta"></p>
        <p class="meta">Last edited ${new Date(d.updatedAt).toLocaleDateString()}</p>
        <div class="actions">
          <a href="index.html?id=${d._id}"><button class="open" type="button">Open</button></a>
          <button class="pill delete" type="button">Delete</button>
        </div>`;
      // textContent keeps user-typed names safe to display
      card.querySelector("h3").textContent = d.name;
      // Summary like "Almond · Medium · Glossy" (or "Mixed finish" if nails differ)
      const same = (k) => d.nails.every((n) => n[k] === d.nails[0][k]);
      card.querySelectorAll(".meta")[0].textContent = d.nails.length
        ? ["shape", "length", "finish"].map((k) => (same(k) ? cap(d.nails[0][k]) : "Mixed " + k)).join(" · ")
        : "";

      // Small preview of the hand
      NailHand.draw(card.querySelector("svg"), { nails: d.nails, skinTone: d.skinTone, view: d.view });

      card.querySelector(".delete").addEventListener("click", () => deleteDesign(d._id, d.name));
      grid.appendChild(card);
    });
  } catch (err) {
    statusText.textContent = err.message;
  }
}

async function deleteDesign(id, name) {
  const ok = await showPopup({
    title: "Delete this design?",
    message: `"${name}" will be removed from your saved designs. This can't be undone.`,
    confirmText: "Delete",
    danger: true,
  });
  if (!ok) return;
  const res = await fetch(`/api/sets/${id}`, { method: "DELETE" });
  if (res.ok) loadDesigns();
  else statusText.textContent = "Could not delete that design. Try again.";
}

loadDesigns();
