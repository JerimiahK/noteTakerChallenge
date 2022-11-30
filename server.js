const express = require("express");
const path = require("path");
const noteData = require("./db/db.json");
const uniqid = require("uniqid");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allows express to serve static files from the 'public' directory.
app.use(express.static("public"));

// creates a GET route to index.html.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// creates a GET route to notes.html.
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// creates a GET route to read and return all saved notes from the 'db.json' file.
app.get("/api/notes/", (req, res) => {
  res.json(noteData);
});

// creates a POST route to receive a new note to save on the request body, add it to the 'db.json' file, and then return the new note to the client. Gives each note a unique ID when its saved. (look up NPM packages to do this).
app.post("/api/notes", (req, res) => {
  console.log(`${req.method} request received`);
  const { title, text } = req.body;

  if (text && title) {
    let newNote = {
      title,
      text,
      id: uniqid(),
    };
    noteData.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(noteData, null, 4));

    const response = {
      status: "success",
      body: newNote,
    };
    res.json(response);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const noteIndex = noteData.findIndex((note) => note.id === id);
  console.log(noteIndex);
  let removeNote = noteData.splice(noteIndex, 1);
  fs.writeFileSync("./db/db.json", JSON.stringify(removeNote, null, 4));
  return res.send(removeNote);
});

// instantiates a PORT
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
