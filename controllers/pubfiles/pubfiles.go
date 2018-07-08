package pubfiles

import (
	"log"
	"net/http"

	"../../lib/util"
)

//GetFiles redirect the request to a file in the public directory.
func GetFiles() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := util.CleanPath(r.URL.Path)
		//w.Write([]byte(path))
		log.Println("GET FILES: path -> " + path)
		http.ServeFile(w, r, "."+path)
	}
}
