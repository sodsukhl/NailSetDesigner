// =============================================================
// studio.js — the Create page
// Builds the controls, updates the hand, and saves to the API.
// =============================================================

// ---------- Options (match the wireframe) ----------
const OPTIONS = {
  shape: ["natural", "almond", "square", "stiletto", "coffin"],
  finish: ["matte", "chrome", "glossy"],
  length: ["short", "medium", "long"],
};
const COLOURS = [
  "#d8a99d", "#f5bdd0", "#f7f5f0", "#141414", "#d81e2a",
  "#8b0000", "#6b1a27", "#1f3a6b", "#2e5a3c",
];
const DARK_COLOURS = ["#141414", "#8b0000", "#6b1a27", "#1f3a6b", "#2e5a3c"];
const SKIN_TONES = NailHand.SKIN_TONES; // matches the 4 hand images
const FINGERS = NailHand.FINGER_ORDER; // thumb, index, middle, ring, pinky

// ---------- The design being edited ----------
const params = new URLSearchParams(window.location.search);
let setId = params.get("id"); // set when editing a saved design
// The starting look (also used by the Reset button)
function defaultNails() {
  return FINGERS.map((position) => ({
    position, shape: "natural", length: "medium", colour: "#d8a99d", finish: "glossy",
  }));
}
let design = { name: "Name design", skinTone: SKIN_TONES[0], view: "one", nails: defaultNails() };
let editing = "all"; // "all" or one finger, e.g. "index"

const handSvg = document.getElementById("hand");
const nameInput = document.getElementById("set-name");
const statusText = document.getElementById("status");
const summary = document.getElementById("summary");

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// The nail whose settings the controls should show
function currentNail() {
  return design.nails.find((n) => n.position === (editing === "all" ? "thumb" : editing));
}

// Change one setting on the nail(s) being edited
function setValue(key, value) {
  design.nails.forEach((n) => {
    if (editing === "all" || n.position === editing) n[key] = value;
  });
  statusText.textContent = "Unsaved changes";
  update();
}

// ---------- Build the buttons once ----------
function makeButton(parent, className, label, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = label;
  b.addEventListener("click", onClick);
  parent.appendChild(b);
  return b;
}

// Editing: All nails / Thumb / Index ...
const nailPicker = document.getElementById("nail-picker");
["all", ...FINGERS].forEach((f) => {
  const b = makeButton(nailPicker, "pill", f === "all" ? "All nails" : cap(f), () => {
    editing = f;
    update();
  });
  b.dataset.value = f;
});

// Shape, finish and length pills
document.querySelectorAll("[data-option]").forEach((group) => {
  const key = group.dataset.option;
  OPTIONS[key].forEach((value) => {
    const b = makeButton(group, "pill", cap(value), () => setValue(key, value));
    b.dataset.value = value;
  });
});

// Colour swatches
const colourBox = document.getElementById("colours");
COLOURS.forEach((c) => {
  const b = makeButton(colourBox, "swatch" + (DARK_COLOURS.includes(c) ? " dark" : ""), "", () => setValue("colour", c));
  b.style.background = c;
  b.dataset.value = c;
  b.setAttribute("aria-label", "Colour " + c);
});
document.getElementById("colour-picker").addEventListener("input", (e) => setValue("colour", e.target.value));

// Skin tones
const skinBox = document.getElementById("skin-tones");
SKIN_TONES.forEach((tone) => {
  const isDark = SKIN_TONES.indexOf(tone) >= 2; // white tick on the darker tones
  const b = makeButton(skinBox, "swatch" + (isDark ? " dark" : ""), "", () => {
    design.skinTone = tone;
    statusText.textContent = "Unsaved changes";
    update();
  });
  b.style.background = tone;
  b.dataset.value = tone;
  b.setAttribute("aria-label", "Skin tone " + tone);
});

// One hand / Both hands switch
const viewButtons = document.querySelectorAll("[data-view]");
viewButtons.forEach((b) =>
  b.addEventListener("click", () => {
    design.view = b.dataset.view;
    statusText.textContent = "Unsaved changes";
    update();
  })
);

nameInput.addEventListener("input", () => {
  design.name = nameInput.value;
  statusText.textContent = "Unsaved changes";
  sizeTitle();
});
nameInput.addEventListener("focus", () => nameInput.select());
// Browsers without CSS field-sizing: size the title by measuring the text
function sizeTitle() {
  if (CSS.supports("field-sizing", "content")) return;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = getComputedStyle(nameInput).font;
  nameInput.style.width = Math.ceil(ctx.measureText(nameInput.value || "Name").width) + 8 + "px";
}

// ---------- Redraw everything to match `design` ----------
function update() {
  const nail = currentNail();

  NailHand.draw(handSvg, {
    nails: design.nails,
    skinTone: design.skinTone,
    view: design.view,
    selected: editing === "all" ? null : editing,
    onSelect: (finger) => {
      editing = editing === finger ? "all" : finger; // click again to go back to all
      update();
    },
  });

  // Highlight the chosen button in each group
  const mark = (container, value) =>
    container.querySelectorAll("button").forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.value === value)
    );
  mark(nailPicker, editing);
  document.querySelectorAll("[data-option]").forEach((g) => mark(g, nail[g.dataset.option]));
  mark(colourBox, nail.colour);
  mark(skinBox, design.skinTone);
  viewButtons.forEach((b) => b.setAttribute("aria-pressed", b.dataset.view === design.view));

  // "Your set:" pills show the shape, finish and length being edited
  summary.innerHTML = "";
  ["shape", "finish", "length"].forEach((k) => {
    const tag = document.createElement("span");
    tag.className = "pill tag";
    tag.textContent = cap(nail[k]);
    summary.appendChild(tag);
  });
}

// ---------- RESET: put every nail back to the starting look ----------
// (Only changes the screen. The saved copy stays until you press Save.)
document.getElementById("reset").addEventListener("click", async () => {
  const ok = await showPopup({
    title: "Reset your set?",
    message: "All nails and the skin tone will go back to the starting look. Your saved copy won't change unless you press Save.",
    confirmText: "Reset",
  });
  if (!ok) return;
  design.nails = defaultNails();
  design.skinTone = SKIN_TONES[0];
  editing = "all";
  statusText.textContent = "Unsaved changes";
  update();
});

// ---------- SAVE: create (POST) or update (PUT) ----------
document.getElementById("save").addEventListener("click", async () => {
  statusText.textContent = "Saving…";
  try {
    const res = await fetch(setId ? `/api/sets/${setId}` : "/api/sets", {
      method: setId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(design),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    const saved = await res.json();
    if (!setId) {
      // Remember the ID so the next save updates instead of duplicating
      setId = saved._id;
      history.replaceState(null, "", `?id=${setId}`);
    }
    statusText.textContent = "All changes saved";
  } catch (err) {
    statusText.textContent = "Could not save: " + err.message;
  }
});

// Older designs used different swatch colours, so map them to the new ones
function matchSkinTone(tone) {
  const oldTones = ["#f6e1d6", "#edb58a", "#c47a55", "#8a3f22"];
  if (SKIN_TONES.includes(tone)) return tone;
  if (oldTones.includes(tone)) return SKIN_TONES[oldTones.indexOf(tone)];
  return SKIN_TONES[0];
}

// ---------- LOAD: open a saved design (?id=...) ----------
async function loadDesign() {
  if (!setId) return;
  statusText.textContent = "Loading…";
  try {
    const res = await fetch(`/api/sets/${setId}`);
    if (!res.ok) throw new Error("Design not found");
    const saved = await res.json();
    design = {
      name: saved.name,
      skinTone: matchSkinTone(saved.skinTone),
      view: saved.view || "one",
      nails: saved.nails,
    };
    nameInput.value = design.name;
    sizeTitle();
    statusText.textContent = "All changes saved";
  } catch (err) {
    statusText.textContent = err.message;
    setId = null;
  }
  update();
}

sizeTitle();
update();
loadDesign();
