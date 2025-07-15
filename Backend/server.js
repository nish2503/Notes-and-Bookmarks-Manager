const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); // Parse incoming JSON
app.use("/api/bookmarks", require("./routes/bookmarks"));


// Routes
app.use("/api/notes", require("./routes/notes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
