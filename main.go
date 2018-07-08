package main

import (
	"log"
	"net/http"
	"time"

	"./controllers"
	"./controllers/note"
	"github.com/gorilla/mux"
)

func main() {
	log.Println("Start Program.")

	r := mux.NewRouter().StrictSlash(false)
	port := ":3000"

	r.HandleFunc("/api/notes", note.GetNoteHandler).Methods("GET")
	r.HandleFunc("/api/notes", note.CreateNoteHandler).Methods("POST")
	r.HandleFunc("/api/notes/{id}", note.UpdateNoteHandler).Methods("PUT")
	r.HandleFunc("/api/notes/{id}", note.DeleteNoteHandler).Methods("DELETE")
	r.HandleFunc("/notes", note.ViewHandler).Methods("GET")
	r.HandleFunc("/", controllers.Index).Methods("GET")
	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir("./public"))))
	//r.PathPrefix("/public/").Handler(http.StripPrefix("", pubfiles.GetFiles()))

	server := &http.Server{
		Addr:           port,
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Println("------------------------------------")
	log.Println("Server running on port " + port + ".")
	log.Println("------------------------------------")

	server.ListenAndServe()
}
