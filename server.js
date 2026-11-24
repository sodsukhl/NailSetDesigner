// =============================================================
// server.js — the backend (your API)
// It receives requests from the frontend, talks to MongoDB,
// and sends data back.
// =============================================================
require("dotenv").config(); // loads MONGODB_URI from the .env file
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const NailSet = require("./models/NailSet");

const app = express();
app.use(express.json({ limit: "2mb" })); // lets the server read JSON sent from the browser
app.use(express.static(path.join(__dirname, "public"))); // serves the frontend locally

// ---------- Connect to MongoDB (reuses one connection) ----------
let connection = null;
async function connectDB() {
  if (connection) return connection;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Check your .env file.");
  }
  connection = await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  return connection;
}

// Make sure the database is connected before any /api route runs
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not connect to the database" });
  }
});

// ================== API ROUTES (CRUD) ==================

// READ all: GET /api/sets  -> list every saved set (newest first)
app.get("/api/sets", async (req, res) => {
  const sets = await NailSet.find().sort({ updatedAt: -1 });
  res.json(sets);
});

// READ one: GET /api/sets/:id  -> one set by its ID
app.get("/api/sets/:id", async (req, res) => {
  try {
    const set = await NailSet.findById(req.params.id);
    if (!set) return res.status(404).json({ error: "Set not found" });
    res.json(set);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// CREATE: POST /api/sets  -> save a new set
app.post("/api/sets", async (req, res) => {
  try {
    const set = await NailSet.create(req.body);
    res.status(201).json(set);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE: PUT /api/sets/:id  -> save changes to an existing set
app.put("/api/sets/:id", async (req, res) => {
  try {
    const set = await NailSet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!set) return res.status(404).json({ error: "Set not found" });
    res.json(set);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: DELETE /api/sets/:id  -> remove a set
app.delete("/api/sets/:id", async (req, res) => {
  try {
    const set = await NailSet.findByIdAndDelete(req.params.id);
    if (!set) return res.status(404).json({ error: "Set not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// ---------- Start the server on your computer ----------
// (On Vercel this part is skipped; Vercel runs the exported app.)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Nail Set Designer running at http://localhost:${PORT}`);
  });
}

module.exports = app;
