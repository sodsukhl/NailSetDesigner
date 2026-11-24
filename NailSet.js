// =============================================================
// NailSet model (the "schema" / data model)
// This file tells MongoDB what a saved nail set looks like.
// =============================================================
const mongoose = require("mongoose");

// One nail. A set holds a list of these (nested inside the set).
const nailSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      enum: ["thumb", "index", "middle", "ring", "pinky"],
      required: true,
    },
    shape: {
      type: String,
      enum: ["natural", "almond", "square", "stiletto", "coffin"],
      default: "natural",
    },
    length: {
      type: String,
      enum: ["short", "medium", "long"],
      default: "medium",
    },
    colour: { type: String, default: "#d8a99d" }, // hex colour code
    finish: {
      type: String,
      enum: ["matte", "chrome", "glossy"],
      default: "glossy",
    },
    drawing: { type: String, default: "" }, // optional, added later
  },
  { _id: false } // nails don't need their own IDs
);

// One saved nail set (one hand, 5 nails).
const nailSetSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "Untitled design" },
    skinTone: { type: String, default: "#fbcb9d" },
    view: { type: String, enum: ["one", "both"], default: "one" }, // one hand or both
    nails: [nailSchema],
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("NailSet", nailSetSchema);
