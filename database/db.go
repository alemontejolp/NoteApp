package database

import (
	"time"
)

//Note is a structure used as model for notes in the system.
type Note struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	ID          int       `json:"id"`
}

//NoteTable is a container for every notes in the simulated database.
var NoteTable = make(map[int]Note)

//id is used for increment the id record.
var id int

//Test is a fake variable.
var Test string

//InsertNote insert in the NoteTable the note provided.
func InsertNote(note Note) Note {
	id++
	note.CreatedAt = time.Now()
	note.ID = id
	NoteTable[id] = note
	return note
}

//UpdateNote update a note in the table.
func UpdateNote(note Note, newNote Note) Note {
	note.Title = newNote.Title
	note.Description = newNote.Description
	NoteTable[note.ID] = note
	return note
}
