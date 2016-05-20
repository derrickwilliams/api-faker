/*
* @Author: dingxijin
* @Date:   2016-05-20 15:30:48
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-20 19:10:07
 */

package main

import (
	"encoding/json"

	"net/http"
)

type API struct {
	Path   string            `json:"path"`
	Method string            `json:"method"`
	Header map[string]string `json:"header,omitempty"`
	Body   string            `json:"body"`
}

var apis []API

func apiHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/add" && r.Method == http.MethodPost {
		var api API
		if err := json.NewDecoder(r.Body).Decode(&api); err != nil {
			http.Error(w, "internal errror", http.StatusInternalServerError)
			return
		}

		apis = append(apis, api)
	}
	w.WriteHeader(http.StatusOK)
}
