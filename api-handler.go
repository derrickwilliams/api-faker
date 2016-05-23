/*
* @Author: dingxijin
* @Date:   2016-05-20 15:30:48
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-23 16:14:27
 */

package main

import (
	"encoding/json"
	"strconv"

	"net/http"
)

type API struct {
	Path        string `json:"path"`
	Method      string `json:"method"`
	ContentType string `json:"content_type"`
	Body        string `json:"body"`
}

const MAX_API_NUMBER = 20

var apis []*API

func apiHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/add" && r.Method == http.MethodPost {
		addAPI(w, r)
		return
	}

	if r.URL.Path == "/delete" && r.Method == http.MethodPost {
		indexStr := r.URL.Query().Get("index")
		index, err := strconv.Atoi(indexStr)
		if err != nil {
			badRequest(w)
			return
		}

		deleteAPI(w, index)
	}

	if r.URL.Path == "/update" && r.Method == http.MethodPost {
		indexStr := r.URL.Query().Get("index")
		index, err := strconv.Atoi(indexStr)

		var api API
		jsonErr := json.NewDecoder(r.Body).Decode(&api)

		if err != nil || jsonErr != nil {
			badRequest(w)
			return
		}

		updateAPI(w, index, &api)
	}

	if r.URL.Path == "/get" && r.Method == http.MethodGet {
		getAPI(w, r)
		return
	}

	http.Error(w, "not found", http.StatusNotFound)
}

func addAPI(w http.ResponseWriter, r *http.Request) {
	var api API
	if err := json.NewDecoder(r.Body).Decode(&api); err != nil {
		http.Error(w, "internal errror", http.StatusInternalServerError)
		return
	}

	if len(apis) == MAX_API_NUMBER {
		apis = apis[0 : MAX_API_NUMBER-1]
	}

	apis = prependAPI(&api, apis)
}

func getAPI(w http.ResponseWriter, r *http.Request) {
	content, err := json.Marshal(apis)

	if err != nil {
		internalServerError(w)
		return
	} else {
		w.Header().Set("content-type", "application/json")
		if len(apis) == 0 {
			content = []byte("[]")
		}
		w.Write(content)
	}
}

func deleteAPI(w http.ResponseWriter, index int) {
	if apis[index] != nil {
		apis = append(apis[0:index], apis[index+1:]...)
		w.WriteHeader(http.StatusOK)
	} else {
		badRequest(w)
	}
}

func updateAPI(w http.ResponseWriter, index int, api *API) {
	if apis[index] != nil {
		apis[index] = api
		w.WriteHeader(http.StatusOK)
	} else {
		badRequest(w)
	}
}

func prependAPI(api *API, apis []*API) []*API {
	return append([]*API{api}, apis...)
}
