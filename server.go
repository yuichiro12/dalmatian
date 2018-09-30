package main

import (
	"net/http"
	"log"
)

func main() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8090", nil))
}

func handler(w http.ResponseWriter, r *http.Request) {
	basePath := "./public/index.html"
	http.ServeFile(w, r, basePath)
}
