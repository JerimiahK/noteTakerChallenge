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
  return res.json(noteData);
});

// creates a POST route to receive a new note to save on the request body, add it to the 'db.json' file, and then return the new note to the client. Gives each note a unique ID when its saved. (look up NPM packages to do this).
app.post("/api/notes", (req, res) => {
  console.log(`${req.method} request received`);
  let notesArr = fs.readFileSync("./db/db.json");
  console.log(notesArr + "notesArr");
  notesArr = JSON.parse(notesArr);
  res.json(notesArr);
  let newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uniqid(),
  };
  notesArr.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notesArr));
  console.log(newNote + "newNote");
});

// instantiates a PORT
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
