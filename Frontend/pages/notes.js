import { useEffect, useState } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false); // ⭐ Favorite filter toggle

 const API = "http://localhost:5000/api/notes";

  // 🔁 Fetch notes
  const fetchNotes = async () => {
    try {
      let url = `${API}?q=${search}`;
      if (showFavorites) url += "&favorite=true"; // ✅ Favorite filter
      const res = await fetch(url);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, showFavorites]);

  // ➕ Add new note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title is required");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()),
        favorite:false
      }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setTags("");
      fetchNotes();
    } else {
      alert("Failed to add note");
    }
  };

  // ❌ Delete note
  const deleteNote = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  // ⭐ Toggle favorite
  const toggleFavorite = async (note) => {
    await fetch(`${API}/${note._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...note, favorite: !note.favorite }),
    });
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">📝 My Notes</h1>

      {/* 🔍 Search */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full border border-gray-300 rounded-lg p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`text-sm px-3 py-2 rounded border ${
            showFavorites ? "bg-yellow-200 border-yellow-500" : "border-gray-300"
          }`}
        >
          ⭐ {showFavorites ? "Showing Favorites" : "All"}
        </button>
      </div>

      {/* ➕ Add Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded-lg mb-6 shadow"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="w-full p-2 mb-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-2 mb-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Note
        </button>
      </form>

      {/* 📋 Notes List */}
      <div className="space-y-4">
        {notes.length === 0 && (
          <p className="text-gray-500">No notes found.</p>
        )}
        {notes.map((note) => (
          <div
            key={note._id}
            className="border rounded p-4 bg-white shadow flex justify-between items-start"
          >
            <div className="max-w-[90%]">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
              <div className="text-sm text-gray-500 mt-1">
                Tags: {note.tags?.join(", ")}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              {/* ⭐ Favorite Button */}
              <button
                onClick={() => toggleFavorite(note)}
                title={note.favorite ? "Unmark Favorite" : "Mark as Favorite"}
                className={`text-2xl ${
                  note.favorite ? "text-yellow-500" : "text-gray-400"
                } hover:scale-110 transition`}
              >
                {note.favorite ? "⭐" : "☆"}
              </button>

              {/* ❌ Delete Button */}
              <button
                onClick={() => deleteNote(note._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
