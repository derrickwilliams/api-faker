/*
* @Author: dingxijin
* @Date:   2016-05-20 15:21:02
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-23 11:44:15
 */

package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

var staticHandler = http.FileServer(http.Dir("static"))

func main() {
	port := flag.Int("port", 9200, "server port")

	http.Handle("/api/", http.StripPrefix("/api", http.HandlerFunc(apiHandler)))
	http.HandleFunc("/", mainHandler)

	fmt.Printf("Server is listening on %d\n", *port)
	log.Fatalln(http.ListenAndServe(fmt.Sprintf(":%d", *port), nil))
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	var result *API
	for _, api := range apis {
		if api.Path == r.URL.Path && strings.ToUpper(api.Method) == r.Method {
			result = api
			break
		}
	}

	if result != nil {
		w.Header().Set("Content-Type", result.ContentType)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		io.WriteString(w, result.Body)
	} else {
		staticHandler.ServeHTTP(w, r)
	}
}
