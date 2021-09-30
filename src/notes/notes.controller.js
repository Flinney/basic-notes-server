const path = require("path");
const notes = require(path.resolve("src/data/notes-data"));

//middleware
const noteExists = (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    return next();
  } else {
    return next({
      status: 404,
      message: `Note id not found: ${req.params.noteId}`,
    });
  }
};

const hasText = (req, res, next) => {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  return next({ status: 400, message: "A 'text' property is required." });
};
//read
function read(req, res, next) {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  res.json({ data: foundNote });
}

//list
function list(req, res) {
  res.json({ data: notes });
}

//create
function create(req, res, next) {
  const { data: { text } = {} } = req.body;

  const newNote = {
    id: notes.length + 1, // Assign the next ID
    text,
  };
  notes.push(newNote);
  res.status(201).json({ data: newNote });
}

//update
function update(req, res) {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  const { data: { text } = {} } = req.body;
  foundNote.text = text;
  res.status(200).json({ data: foundNote });
}

//delete
function annihilate(req, res) {
  const noteId = Number(req.params.noteId);
  const index = notes.findIndex((note) => note.id === noteId);
  notes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  create: [hasText, create],
  list,
  read: [noteExists, read],
  update: [hasText, noteExists, update],
  delete: [noteExists, annihilate],
};
