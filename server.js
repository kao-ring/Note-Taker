//Modules
var express = require("express");
var path = require("path");
var fs = require("fs");

var PORT = process.env.PORT || 3000;

//setup expresss app
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//GET html file
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//GET /api/notes
app.get("/api/notes", function (req, res) {
  const noteArray = JSON.parse(fs.readFileSync("db/db.json"));
  return res.json(noteArray);
});

//POST /api/notes
app.post("/api/notes", (req, res) => {
  const noteArray = JSON.parse(fs.readFileSync("db/db.json"));
  const newNote = req.body; //posted data
  newNote.id = new Date(); //give ID for delete
  console.log(newNote);
  noteArray.push(newNote);
  fs.writeFileSync("db/db.json", JSON.stringify(noteArray));
  return res.json(noteArray);
});

//DELETE /api/notes/:id
app.delete("/api/notes/:id", function (req, res) {
  const noteArray = JSON.parse(fs.readFileSync("db/db.json"));
  console.log(req.params.id);
  var newNoteArray = noteArray.filter((note) => note.id !== req.params.id); //filter with target id
  fs.writeFileSync("db/db.json", JSON.stringify(newNoteArray)); //rewrite
  return res.json(newNoteArray);
});

// Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
