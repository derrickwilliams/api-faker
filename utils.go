/*
* @Author: CJ Ting
* @Date:   2016-05-23 11:00:51
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-23 13:54:51
 */

package main

import "net/http"

func internalServerError(w http.ResponseWriter) {
	http.Error(w, "internal server error!", http.StatusInternalServerError)
}

func badRequest(w http.ResponseWriter) {
	http.Error(w, "bad request", http.StatusBadRequest)
}
