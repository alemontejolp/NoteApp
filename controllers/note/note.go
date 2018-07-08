package note

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"../../database"
	"../../response"
)

//GetNoteHandler get all notes.
func GetNoteHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Request to GetNoteHandler")
	var notes []database.Note
	for _, note := range database.NoteTable {
		notes = append(notes, note)
	}

	//log.Println(notes)

	w.Header().Set("Content-Type", "application/json")

	datatype := "array"
	if len(notes) == 0 {
		datatype = "null"
	}

	res := response.Response{
		Status:   http.StatusOK,
		Success:  true,
		Message:  "OK",
		DataType: datatype,
		Data:     notes,
	}
	j, err := json.Marshal(res)
	//log.Println(string(j))

	if err != nil {
		panic(err)
	}

	w.WriteHeader(http.StatusOK)
	w.Write(j)
}

//CreateNoteHandler insert a new note in the DB.
func CreateNoteHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Request to CreateNoteHandler")
	var note database.Note
	//log.Println(r.Body)
	err := json.NewDecoder(r.Body).Decode(&note)
	log.Println(note)

	if err != nil {
		panic(err)
	}

	note = database.InsertNote(note)
	status := http.StatusCreated
	res := response.Response{
		Success:  true,
		Status:   status,
		Message:  "OK",
		DataType: "object",
		Data:     note,
	}
	j, err := json.Marshal(res)
	//log.Println(string(j))

	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(j)
}

//UpdateNoteHandler update the note with the id provided
func UpdateNoteHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Request to UpdateNoteHandler")
	vars := mux.Vars(r)
	idProv := vars["id"]
	id, err := strconv.Atoi(idProv)
	if err != nil {
		log.Println("PANIC -- Saliendo.")
		panic(err)
	}

	var newNote database.Note
	err = json.NewDecoder(r.Body).Decode(&newNote)

	if err != nil {
		log.Println("PANIC -- Saliendo.")
		panic(err)
		return
	}

	//log.Println(newNote)

	var res response.Response
	var status int

	note, ok := database.NoteTable[id]

	if ok {
		note = database.UpdateNote(note, newNote)
		res.Success = true
		res.Status = http.StatusAccepted
		res.Message = "OK"
		res.DataType = "object"
		res.Data = note

		status = http.StatusAccepted
	} else {
		res.Success = false
		res.Status = http.StatusNotFound
		res.Message = "La nota (" + idProv + ") no existe."
		res.DataType = "null"
		res.Data = nil

		status = http.StatusNotFound
	}

	//log.Println(res)

	j, err := json.Marshal(res)
	if err != nil {
		log.Println("PANIC -- Saliendo.")
		panic(err)
		return
	}

	//log.Println(string(j))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(j)
}

//DeleteNoteHandler delete a note by id.
func DeleteNoteHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Request to DeleteNoteHandler")
	idProv := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idProv)
	if err != nil {
		panic(err)
	}

	var res response.Response
	var status int

	if _, ok := database.NoteTable[id]; ok {
		delete(database.NoteTable, id)
		res.Status = http.StatusOK
		res.Success = true
		res.Message = "Nota borrada."
		res.DataType = "null"
		res.Data = nil

		status = http.StatusOK
	} else {
		res.Status = http.StatusNotFound
		res.Success = false
		res.Message = "La nota no existe"
		res.DataType = "null"
		res.Data = nil

		status = http.StatusNotFound
	}

	j, err := json.Marshal(res)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(j)
}
