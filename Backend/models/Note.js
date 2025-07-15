const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  tags: [String],
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }
});

module.exports = mongoose.model("Note", noteSchema);
