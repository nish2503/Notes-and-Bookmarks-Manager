const Note = require("../models/Note");

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = new Note({
      title,
      content,
      tags,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all notes with optional filtering
const getNotes = async (req, res) => {
  try {
    const { q, tags } = req.query;

    let filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    console.error("Error getting notes:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    console.log("Updating note:", req.params.id, req.body);
    const { title, content, tags } = req.body;

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Note not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating note:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Error deleting note:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Export all functions properly
module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
