# 📒 Notes & Bookmarks Manager

A **full-stack web app** to manage personal notes and bookmarks — built with **Node.js**, **Express**, **MongoDB**, and **Next.js (React)**. Users can add, edit, delete, search, tag, and favorite their notes and bookmarks.

✅ **No login required** – it’s local and simple to set up for personal use.

---

## 🚀 Features

### 📝 Notes
- Create, edit, delete notes
- Search by title or content
- Tag support
- Mark/unmark notes as favorites ⭐
- Filter notes by favorite or tags

### 🔖 Bookmarks
- Add bookmark with title, description, tags
- Automatically fetch title from the webpage
- Search by title or description
- Mark/unmark bookmarks as favorites ⭐
- Filter bookmarks by tags or favorite

---

## 🛠 Tech Stack

| Layer       | Tech Stack                        |
|-------------|-----------------------------------|
| Frontend    | Next.js (React), Tailwind CSS     |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB (via Mongoose)            |
| Utilities   | Axios, valid-url (title fetching) |

---

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── models/          # Mongoose models for Note & Bookmark
│   ├── routes/          # Express routes for API
│   ├── config/          # DB connection file
│   ├── .env             # Environment variables (local)
│   └── server.js        # Entry point
├── frontend/
│   ├── pages/           # Next.js pages (notes.js, bookmarks.js)
│   └── components/      # (Optional) Shared UI components
```

---

## ⚙️ Local Setup

### 📦 Prerequisites

- Node.js (v18 or later)
- MongoDB installed locally

---

### 🔧 Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notesdb
```

Start backend server:

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

### 🎨 Step 2: Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🔍 Usage

1. Open **http://localhost:3000**
2. Start adding notes or bookmarks
3. Search notes/bookmarks using keywords
4. Filter by tags or mark your favorites ⭐
5. Enjoy a clean, responsive UI

---

## 🛠 Backend API Overview

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | `/api/notes`          | Get all notes              |
| POST   | `/api/notes`          | Add a new note             |
| PUT    | `/api/notes/:id`      | Update a note              |
| DELETE | `/api/notes/:id`      | Delete a note              |
| GET    | `/api/bookmarks`      | Get all bookmarks          |
| POST   | `/api/bookmarks`      | Add a new bookmark         |
| PUT    | `/api/bookmarks/:id`  | Update a bookmark          |
| DELETE | `/api/bookmarks/:id`  | Delete a bookmark          |

---

## 💡 Bonus Features

- Auto title fetching using `<title>` tag when URL is saved
- Responsive UI with Tailwind CSS
- Optimized state updates with `useEffect` and `useState`

---

## 📌 Troubleshooting

### 🔴 "Failed to fetch"
- Make sure **backend server is running**
- Check **CORS** headers are enabled in backend
- Verify MongoDB is running locally

### 🔴 Notes not saving?
- Confirm you're sending `Content-Type: application/json`
- Make sure MongoDB server is not blocked by firewall
