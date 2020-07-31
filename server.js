var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
var app = express();
var PORT = 3000;

// app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// The following HTML routes should be created:
//GET /notes - Should return the notes.html file.
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
//GET * - Should return the index.html file
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// The application should have a db.json file on the backend that will be used to store and retrieve notes using the fs module.
// The following API routes should be created:
//      GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
  const noteBody = JSON.parse(fs.readFileSync("db/db.json"));
  return res.json(noteBody);
});
//      POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.

app.post("/api/notes", (req, res) => {
  const noteBody = JSON.parse(fs.readFileSync("db/db.json"));
  const newNotes = req.body;
  newNotes.id = new Date();
  console.log(newNotes);
  noteBody.push(newNotes);
  fs.writeFileSync("db/db.json", JSON.stringify(noteBody));
  return res.json(noteBody);
});

// app.post("/api/notes", function (req, res) {
//   notesdb.push(req.body);
//   res.json(true);
// });

//      DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

app.delete("/api/notes/:id", function (req, res) {
  const noteBody = JSON.parse(fs.readFileSync("db/db.json"));
  // var id = req.params.id;
  //filter...?
  noteBody = noteBody.filter((singleNote) => singleNote.id !== req.params.id);

  fs.writeFileSync("db/db.json", JSON.stringify(noteBody));
  return res.json(noteBody);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
