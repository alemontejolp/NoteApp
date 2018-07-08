package note

import (
	"io/ioutil"
	"net/http"
)

//ViewHandler returns the notes template.
func ViewHandler(w http.ResponseWriter, r *http.Request) {
	page, err := ioutil.ReadFile("./templates/notes.html")
	if err != nil {
		panic(err)
	}
	w.Write(page)
}
