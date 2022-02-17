const connectDb = require("./db/db");
const userRoutes = require("./routes/users");
const songRoutes = require("./routes/songs");
const searchRoutes = require("./routes/search");
const playlistRoutes = require("./routes/playlists")
const express = require("express");
const cors = require("cors");
const app = express();

connectDb();


app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/search", searchRoutes);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening on port ${port}...`));
