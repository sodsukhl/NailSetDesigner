// =============================================================
// hand.js — shows your Figma hand images and draws the nails on top
// Used by the Create page (big, clickable) and Saved Designs (previews).
// =============================================================
(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const LINE = "#1a1a1a"; // nail outline colour

  // The 4 skin tones, in the same order as the images skintone1-4.
  // (The swatch colours were sampled from your images.)
  const SKIN_TONES = ["#fbcb9d", "#b16d4a", "#743e2b", "#4e2415"];
  // Older saved designs used these colours, so they still map to the right image
  const OLD_TONES = ["#f6e1d6", "#edb58a", "#c47a55", "#8a3f22"];

  // Measured from the white nails in each of your images (per skin tone).
  //   x, y = middle of the cuticle, angle = tilt (0 = straight up),
  //   width = nail width, length = cuticle to fingertip
  const IMAGES = {
    1: {
      single: { width: 1492, height: 2402 },
      pair: { width: 2952, height: 2402 },
      left: {
        pinky:  { x: 79.4, y: 725.2, angle: -12.2, width: 66.3, length: 127.0 },
        ring:   { x: 361.2, y: 364.0, angle: -6.1, width: 98.7, length: 143.2 },
        middle: { x: 580.9, y: 200.9, angle: -8.8, width: 109.0, length: 147.3 },
        index:  { x: 877.6, y: 281.0, angle: -0.2, width: 102.9, length: 141.9 },
        thumb:  { x: 1327.3, y: 1134.3, angle: 19.6, width: 64.4, length: 175.5 },
      },
      right: {
        thumb:  { x: 1626.1, y: 1133.6, angle: -21.7, width: 66.0, length: 184.4 },
        index:  { x: 2072.8, y: 281.2, angle: 1.0, width: 102.3, length: 142.2 },
        middle: { x: 2373.2, y: 201.1, angle: 6.1, width: 108.5, length: 153.5 },
        ring:   { x: 2588.6, y: 363.7, angle: 6.9, width: 97.6, length: 143.9 },
        pinky:  { x: 2869.1, y: 724.9, angle: 15.6, width: 64.7, length: 124.0 },
      },
    },
    2: {
      single: { width: 1491, height: 2404 },
      pair: { width: 2952, height: 2404 },
      left: {
        pinky:  { x: 81.8, y: 726.2, angle: -16.3, width: 63.7, length: 126.4 },
        ring:   { x: 362.4, y: 365.0, angle: -8.1, width: 96.8, length: 148.1 },
        middle: { x: 577.3, y: 202.6, angle: -6.3, width: 108.6, length: 146.8 },
        index:  { x: 879.9, y: 282.5, angle: -3.0, width: 102.8, length: 158.3 },
        thumb:  { x: 1330.6, y: 1137.2, angle: 17.7, width: 71.8, length: 174.4 },
      },
      right: {
        thumb:  { x: 1628.9, y: 1132.1, angle: -26.2, width: 66.4, length: 181.2 },
        index:  { x: 2070.3, y: 282.5, angle: 2.6, width: 102.3, length: 161.0 },
        middle: { x: 2371.7, y: 202.6, angle: 6.8, width: 108.4, length: 154.2 },
        ring:   { x: 2586.7, y: 365.1, angle: 7.9, width: 97.2, length: 146.5 },
        pinky:  { x: 2865.1, y: 725.3, angle: 19.4, width: 62.7, length: 141.4 },
      },
    },
    3: {
      single: { width: 1491, height: 2404 },
      pair: { width: 2952, height: 2404 },
      left: {
        pinky:  { x: 83.6, y: 726.1, angle: -16.7, width: 64.1, length: 125.9 },
        ring:   { x: 364.0, y: 364.8, angle: -8.2, width: 96.7, length: 146.5 },
        middle: { x: 578.8, y: 202.6, angle: -6.5, width: 108.7, length: 156.8 },
        index:  { x: 878.7, y: 283.1, angle: -0.7, width: 102.2, length: 150.1 },
        thumb:  { x: 1332.3, y: 1137.5, angle: 15.6, width: 66.5, length: 169.1 },
      },
      right: {
        thumb:  { x: 1626.0, y: 1135.4, angle: -20.7, width: 65.6, length: 176.5 },
        index:  { x: 2072.6, y: 282.4, angle: 1.8, width: 102.4, length: 143.7 },
        middle: { x: 2371.5, y: 202.4, angle: 8.2, width: 108.3, length: 150.2 },
        ring:   { x: 2589.6, y: 365.4, angle: 6.5, width: 98.3, length: 145.7 },
        pinky:  { x: 2869.3, y: 726.2, angle: 15.9, width: 64.3, length: 125.3 },
      },
    },
    4: {
      single: { width: 1492, height: 2402 },
      pair: { width: 2952, height: 2402 },
      left: {
        pinky:  { x: 81.9, y: 725.6, angle: -15.7, width: 64.3, length: 129.2 },
        ring:   { x: 363.6, y: 364.3, angle: -8.6, width: 96.6, length: 156.3 },
        middle: { x: 578.2, y: 202.2, angle: -6.6, width: 108.7, length: 155.2 },
        index:  { x: 880.7, y: 282.3, angle: -3.2, width: 103.2, length: 156.3 },
        thumb:  { x: 1330.1, y: 1136.1, angle: 16.2, width: 63.0, length: 175.2 },
      },
      right: {
        thumb:  { x: 1626.5, y: 1133.7, angle: -22.4, width: 64.9, length: 178.3 },
        index:  { x: 2070.9, y: 282.4, angle: 2.6, width: 102.2, length: 158.8 },
        middle: { x: 2373.1, y: 202.2, angle: 6.0, width: 108.9, length: 153.5 },
        ring:   { x: 2588.9, y: 364.9, angle: 6.4, width: 97.6, length: 142.7 },
        pinky:  { x: 2868.1, y: 725.3, angle: 16.4, width: 64.1, length: 126.1 },
      },
    },
  };

  // How far the nail grows past the fingertip, as a share of the nail's width
  const LENGTH = { short: 0.3, medium: 0.75, long: 1.3 };
  // Some shapes need a little more length to read clearly
  const SHAPE_REACH = { natural: 0.8, square: 1, almond: 1.1, stiletto: 1.25, coffin: 1.1 };
  // Thumbs grow a bit less, so the gap between the two thumbs stays open
  const THUMB_REACH = 0.7;

  // Extra space around the image so long nails don't get cut off
  const PAD = { top: 260, side: 90 };

  function toneNumber(tone) {
    let i = SKIN_TONES.indexOf(tone);
    if (i === -1) i = OLD_TONES.indexOf(tone);
    return i === -1 ? 1 : i + 1;
  }

  /*
   * The outline of one nail, pointing straight up.
   *   W   = nail width
   *   bed = cuticle (y = 0) to fingertip (y = -bed): straight sides here,
   *         so the nail always follows the finger
   *   ext = how far the nail grows past the fingertip; the shape lives here
   */
  function nailPath(shape, W, bed, ext) {
    const h = W / 2;
    const tip = bed + ext;
    // Rounded cuticle at the bottom, then straight up both sides to the fingertip
    const start = `M ${-h} ${-h * 0.7} Q ${-h} 0 0 0 Q ${h} 0 ${h} ${-h * 0.7} L ${h} ${-bed}`;
    switch (shape) {
      case "square": {
        const r = W * 0.12;
        return `${start} L ${h} ${-tip + r} Q ${h} ${-tip} ${h - r} ${-tip} L ${-h + r} ${-tip} Q ${-h} ${-tip} ${-h} ${-tip + r} Z`;
      }
      case "almond": // soft point
        return `${start} C ${h} ${-bed - ext * 0.55} ${h * 0.45} ${-tip} 0 ${-tip} C ${-h * 0.45} ${-tip} ${-h} ${-bed - ext * 0.55} ${-h} ${-bed} Z`;
      case "stiletto": // sharp point
        return `${start} C ${h} ${-bed - ext * 0.35} ${h * 0.12} ${-bed - ext * 0.8} 0 ${-tip} C ${-h * 0.12} ${-bed - ext * 0.8} ${-h} ${-bed - ext * 0.35} ${-h} ${-bed} Z`;
      case "coffin": // tapers to a flat tip
        return `${start} L ${h * 0.55} ${-tip} L ${-h * 0.55} ${-tip} L ${-h} ${-bed} Z`;
      default: // natural: rounded tip
        return `${start} C ${h} ${-bed - ext * 0.75} ${h * 0.6} ${-tip} 0 ${-tip} C ${-h * 0.6} ${-tip} ${-h} ${-bed - ext * 0.75} ${-h} ${-bed} Z`;
    }
  }

  function el(tag, attrs, parent) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const key in attrs) node.setAttribute(key, attrs[key]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // Draw the 5 nails of one hand into a group
  function drawNails(group, spots, nails, selected, onSelect) {
    nails.forEach((nail) => {
      const spot = spots[nail.position];
      if (!spot) return;
      // Just big enough to cover the black outline around your nail
      const W = spot.width + 12;
      const bed = spot.length + 6;
      const reach = (LENGTH[nail.length] ?? 0.75) * (SHAPE_REACH[nail.shape] ?? 1) *
        (nail.position === "thumb" ? THUMB_REACH : 1);
      const ext = W * reach;
      const d = nailPath(nail.shape, W, bed, ext);
      const isSelected = nail.position === selected;

      const g = el("g", {
        transform: `translate(${spot.x} ${spot.y + 5}) rotate(${spot.angle})`,
        class: "nail",
      }, group);

      el("path", {
        d, fill: nail.colour,
        stroke: isSelected ? "#6e67e0" : LINE,
        "stroke-width": isSelected ? 14 : 7,
        "stroke-linejoin": "round",
      }, g);

      const tip = bed + ext;
      if (nail.finish === "glossy") {
        el("ellipse", {
          cx: -W * 0.2, cy: -tip * 0.52, rx: W * 0.08, ry: tip * 0.2,
          fill: "#fff", opacity: 0.6,
        }, g);
      } else if (nail.finish === "chrome") {
        el("path", { d, fill: "url(#chrome-sheen)" }, g);
      }
      // matte = flat colour, no shine

      if (onSelect) {
        // Invisible area over the nail and fingertip, so it's easy to click
        el("rect", {
          x: -W * 0.8, y: -tip - 20, width: W * 1.6, height: tip + spot.length * 1.3,
          fill: "transparent",
        }, g);
        g.style.cursor = "pointer";
        g.addEventListener("click", () => onSelect(nail.position));
        el("title", {}, g).textContent = nail.position;
      }
    });
  }

  /**
   * Draw the hand into an <svg>.
   * options: { nails, skinTone, view ("one" or "both"), selected, onSelect }
   */
  function draw(svg, { nails, skinTone = SKIN_TONES[0], view = "one", selected = null, onSelect = null }) {
    svg.innerHTML = "";
    const both = view === "both";
    const n = toneNumber(skinTone);
    const image = IMAGES[n];
    const size = both ? image.pair : image.single;
    svg.setAttribute("viewBox", `${-PAD.side} ${-PAD.top} ${size.width + PAD.side * 2} ${size.height + PAD.top}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMax meet");

    // Shiny overlay used by the chrome finish
    const defs = el("defs", {}, svg);
    const grad = el("linearGradient", { id: "chrome-sheen", x1: "0", y1: "0", x2: "1", y2: "0" }, defs);
    [
      [0, "#fff", 0.1], [0.25, "#fff", 0.75], [0.45, "#fff", 0],
      [0.65, "#fff", 0.45], [0.85, "#000", 0.15], [1, "#000", 0.3],
    ].forEach(([offset, color, opacity]) =>
      el("stop", { offset, "stop-color": color, "stop-opacity": opacity }, grad)
    );

    // The hand picture (your files in the hands folder, at their real size)
    el("image", {
      href: `hands/skintone${n}${both ? "" : "single"}.png`,
      x: 0, y: 0, width: size.width, height: size.height,
    }, svg);

    // Left hand nails, then (in "Both hands") the right hand's own nails.
    // Both hands share one design: the right thumb matches the left thumb, etc.
    drawNails(el("g", {}, svg), image.left, nails, selected, onSelect);
    if (both) drawNails(el("g", {}, svg), image.right, nails, selected, onSelect);
  }

  window.NailHand = {
    draw,
    SKIN_TONES,
    FINGER_ORDER: ["thumb", "index", "middle", "ring", "pinky"],
  };
})();
