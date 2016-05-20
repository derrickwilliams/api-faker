/*
* @Author: dingxijin
* @Date:   2016-05-20 15:21:02
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-20 19:21:22
 */

package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

var staticHandler = http.FileServer(http.Dir("static"))

func main() {
	const port = 9200

	http.Handle("/api/", http.StripPrefix("/api", http.HandlerFunc(apiHandler)))
	// http.Handle("/", http.FileServer(http.Dir("static")))
	http.HandleFunc("/", mainHandler)
	http.HandleFunc("/debug/apis", apisHandler)
	fmt.Printf("Server is listening on %d\n", port)
	log.Fatalln(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	content := ""
	for _, api := range apis {
		if api.Path == r.URL.Path && strings.ToUpper(api.Method) == r.Method {
			content = api.Body
			break
		}
	}

	if len(content) != 0 {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		io.WriteString(w, content)
	} else {
		staticHandler.ServeHTTP(w, r)
	}
}

func apisHandler(w http.ResponseWriter, r *http.Request) {
	content, err := json.Marshal(apis)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	} else {
		w.Header().Set("content-type", "application/json")
		w.Write(content)
	}
}
