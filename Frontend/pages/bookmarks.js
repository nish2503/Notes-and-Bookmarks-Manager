import { useEffect, useState } from "react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false); // ⭐ filter toggle

  const API = "http://localhost:5000/api/bookmarks";

  const fetchBookmarks = async () => {
    try {
      let url = `${API}?q=${search}`;
      if (showFavorites) url += "&favorite=true"; // ✅ filter query
      const res = await fetch(url);
      const data = await res.json();
      setBookmarks(data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [search, showFavorites]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return alert("URL is required");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        favorite: false
      }),
    });

    if (res.ok) {
      setUrl("");
      setTitle("");
      setDescription("");
      setTags("");
      fetchBookmarks();
    } else {
      alert("Failed to add bookmark");
    }
  };

  const deleteBookmark = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchBookmarks();
  };

  // ⭐ Toggle favorite
  const toggleFavorite = async (bookmark) => {
    await fetch(`${API}/${bookmark._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...bookmark, favorite: !bookmark.favorite }),
    });
    fetchBookmarks();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🔖 Bookmarks</h1>

      {/* 🔍 Search & Favorite Filter */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search bookmarks..."
          className="w-full border border-gray-300 rounded p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`text-sm px-3 py-2 rounded border ${
            showFavorites ? "bg-yellow-200 border-yellow-500" : "border-gray-300"
          }`}
        >
          ⭐ {showFavorites ? "Favorites" : "All"}
        </button>
      </div>

      {/* ➕ Add Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          placeholder="URL"
          className="w-full p-2 mb-2 border rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Title (optional)"
          className="w-full p-2 mb-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 mb-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          Add Bookmark
        </button>
      </form>

      {/* 📋 Bookmarks List */}
      <div className="space-y-4">
        {bookmarks.length === 0 && (
          <p className="text-gray-500">No bookmarks found.</p>
        )}
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark._id}
            className="border p-4 rounded bg-white shadow flex justify-between items-start"
          >
            <div className="max-w-[90%]">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-semibold text-blue-700 hover:underline"
              >
                {bookmark.title}
              </a>
              <p className="text-gray-700">{bookmark.description}</p>
              <div className="text-sm text-gray-500">
                Tags: {bookmark.tags?.join(", ")}
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={() => toggleFavorite(bookmark)}
                title={bookmark.favorite ? "Unmark Favorite" : "Mark as Favorite"}
                className={`text-2xl ${
                  bookmark.favorite ? "text-yellow-500" : "text-gray-400"
                } hover:scale-110 transition`}
              >
                {bookmark.favorite ? "⭐" : "☆"}
              </button>
              <button
                onClick={() => deleteBookmark(bookmark._id)}
                className="text-red-500 text-sm hover:underline"
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
