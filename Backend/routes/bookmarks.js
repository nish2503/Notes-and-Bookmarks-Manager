const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");
const axios = require("axios");
const { isWebUri } = require("valid-url");

// ------------------------------------------
// 📌 CREATE a new bookmark
// ------------------------------------------
router.post("/", async (req, res) => {
  try {
    let { title, url, description, tags, favorite = false } = req.body;

    // ✅ Validate URL
    if (!url || !isWebUri(url)) {
      return res.status(400).json({ error: "Valid URL is required" });
    }

    // ✅ Bonus: Auto-fetch title from webpage if not provided
    if (!title) {
      try {
        const { data } = await axios.get(url);
        const match = data.match(/<title>(.*?)<\/title>/i);
        if (match) {
          title = match[1];
        } else {
          title = "Untitled Bookmark";
        }
      } catch (err) {
        title = "Untitled Bookmark"; // fallback if request fails
      }
    }

    // ✅ Create and save new bookmark
    const newBookmark = new Bookmark({ title, url, description, tags, favorite });
    await newBookmark.save();
    res.status(201).json(newBookmark);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 📌 GET all bookmarks (with optional filters)
// ------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { q, tags, favorite } = req.query;
    const filter = {};

    // ✅ Search by title or description
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    // ✅ Filter by tags (if passed as comma-separated)
    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    if (favorite === "true") {
      filter.favorite = true;
    }


    const bookmarks = await Bookmark.find(filter);
    res.json(bookmarks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 📌 GET a single bookmark by ID
// ------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 📌 UPDATE a bookmark by ID
// ------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { title, url, description, tags, favorite } = req.body;

    const updatedBookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      { title, url, description, tags, favorite },
      { new: true } // return updated doc
    );

    if (!updatedBookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.json(updatedBookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 📌 DELETE a bookmark by ID
// ------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Bookmark.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Bookmark not found" });
    }
    res.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
