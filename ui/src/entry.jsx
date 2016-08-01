import "dependencies"
import React from "react"
import DOM from "react-dom"

import App from "./app.jsx"

DOM.render(<App />, document.getElementById("app-container"))

if(__DEV__) {
  module.hot.accept()
}
