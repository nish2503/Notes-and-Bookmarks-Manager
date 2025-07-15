// routes/notes.js
const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// 🔹 Create a note
router.post("/", async (req, res) => {
  try {
    const { title, content, tags, favorite = false } = req.body;


    if (!title) return res.status(400).json({ error: "Title is required" });

    const note = new Note({ title, content, tags, favorite });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get all notes (with optional search and tags)
router.get("/", async (req, res) => {
  try {
    const { q, tags, favorite } = req.query;


    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ];
    }

    if (tags) {
      const tagsArray = tags.split(",");
      filter.tags = { $in: tagsArray };
    }

    if (favorite === "true") {
      filter.favorite = true;
    }


    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get a note by ID
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update a note by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, content, tags, favorite } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, favorite },
      { new: true }
    );

    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;