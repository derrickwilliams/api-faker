/*
* @Author: CJ Ting
* @Date:   2016-05-18 14:44:29
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-20 19:25:27
*/

import "./app.styl"
import React from "react"
import DOM from "react-dom"

const App = React.createClass({
  getInitialState() {
    return {
      apis: null,
    };
  },

  submit(evt) {
    evt.preventDefault()
    this.addAPI()
  },

  addAPI() {
    const path = this.refs.path.value
    const method = $(this.refs.method).val()
    const body = this.editor.getValue()

    const api = {
      path,
      method,
      body,
    }

    $.ajax({
      url: "/api/add",
      method: "post",
      contentType: "application/json",
      data: JSON.stringify(api),
      success(d) {
        swal("Success!", "", "success")
      },
      error(jqXHR, status) {
        swal(status, "", "error")
      },
    })
  },

  componentDidMount() {
    this.editor = CodeMirror(this.refs.textarea, {
      theme: "base16-light",
      mode: {
        name: "javascript",
        json: true,
      },
      tabSize: 2,
      lineNumbers: true,
      // keyMap: "vim",
    })
  },

  render() {
    return (
      <section className="app">
        <div className="side-panel">
          <h2 className="color-info">API List</h2>
        </div>

        <main className="main-content">
          <h1>
            Add API
          </h1>

          <form
            className="form-horizontal main-form"
            onSubmit={ this.submit }
          >
            <div className="form-group">
              <label htmlFor="" className="col-md-2 control-label">
                API Path
              </label>
              <div className="col-md-10">
                 <input
                  ref="path"
                  className="form-control"
                  type="text"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="" className="col-md-2 control-label">
                Method
              </label>
              <div className="col-md-10">
                <select
                  ref="method"
                  className="form-control"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="" className="col-md-2 control-label">
                HTTP Headers
              </label>
              <div className="col-md-10">
                <input className="form-control" type="text" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="" className="col-md-2 control-label">
                Body
              </label>
              <div
                className="col-md-10 main-form__editor"
                ref="textarea"
              >
              </div>
            </div>


            <div className="main-form__buttons">
              <button className="btn btn-primary">
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </form>
        </main>
      </section>
    )
  },
})


DOM.render(<App />, document.getElementById("app-container"))
