package controllers

import (
	"net/http"
)

//Index redirect de request to a note app.
func Index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./templates/index.html")
}
