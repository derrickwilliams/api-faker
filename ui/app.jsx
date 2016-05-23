/*
* @Author: CJ Ting
* @Date:   2016-05-18 14:44:29
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-23 16:17:52
*/

import "./app.styl"
import React, { PropTypes } from "react"
import { checkJSON } from "./utils"
import DOM from "react-dom"

const MAX_API_NUMBER = 20

const App = React.createClass({
  key: 0,

  getInitialState() {
    return {
      apis: null,
      api: null,
    };
  },

  componentDidMount() {
    $.getJSON("/api/get")
      .then(d => {
        this.setState({
          apis: d,
        })
      })
  },

  setCurrentAPI(api) {
    this.setState({
      api,
    })
  },

  newAPI() {
    this.setState({
      api: null,
    })
  },

  addAPI(api) {
    if(api.contentType === "application/json" && !checkJSON(api.body)) {
      swal("JSON格式错误！", "", "error")
      return
    }

    $.ajax({
      url: "/api/add",
      method: "post",
      contentType: "application/json",
      data: JSON.stringify(api),
      success: d => {
        this.setState({
          apis: [api, ...this.state.apis.slice(0, MAX_API_NUMBER)],
          api: null,
        })
        swal("Add API Successfully!", "", "success")
      },
      error(jqXHR, status) {
        swal(status, "", "error")
      },
    })
  },

  deleteAPI(index) {
    swal({
      title: "Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Ok",
      cancelButtonText: "Cancel",
      closeOnConfirm: false,
    }, isConfirm => {
      if(!isConfirm) return
      $.ajax({
        url: "/api/delete?index=" + index,
        method: "post",
        success: () => {
          const newAPIs = [...this.state.apis]
          let api = this.state.dsp
          if(this.state.apis[index] === this.state.api) {
            api = null
          }
          newAPIs.splice(index, 1)
          this.setState({
            apis: newAPIs,
            api,
          })
          swal("OK!", "", "success")
        },
        error: (jqXHR, status) => {
          swal(status, "", "error")
        },
      })
    })
  },

  updateAPI(oldAPI, newAPI) {
    const index = this.state.apis.findIndex(api => api === oldAPI)
    const newAPIs = [...this.state.apis]
    newAPIs.splice(index, 1, newAPI)
    $.ajax({
      url: "/api/update?index=" + index,
      method: "post",
      data: JSON.stringify(newAPI),
      success: () => {
        swal("Update API Successfully!", "", "success")
        this.setState({
          apis: newAPIs,
          api: newAPI,
        })
      },
      error(jqXHR, status) {
        swal(status, "", "error")
      },
    })
  },

  render() {
    return (
      <section className="app">
        <APIList
          apis={ this.state.apis }
          api={ this.state.api }
          setCurrentAPI={ this.setCurrentAPI }
          deleteAPI={ this.deleteAPI }
        />

        <APIForm
          key={ this.key++ }
          addAPI={ this.addAPI }
          updateAPI={ this.updateAPI }
          newAPI={ this.newAPI }
          api={ this.state.api }
        />
      </section>
    )
  },
})

const APIForm = React.createClass({
  propTypes: {
    api: PropTypes.object,
  },

  componentDidMount() {
    this.editor = CodeMirror(this.refs.textarea, {
      value: (this.props.api && this.props.api.body) || "",
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

  submit(evt) {
    evt.preventDefault()
    const api = {
      path: this.refs.path.value,
      method: $(this.refs.method).val(),
      contentType: $(this.refs.contentType).val(),
      body: this.editor.getValue(),
    }
    if(this.props.api) {
      this.props.updateAPI(this.props.api, api)
    } else {
      this.props.addAPI(api)
    }
  },

  render() {
    const api = this.props.api || {}
    return (
      <main className="api-form">
        <h2>
          {
            this.props.api ?
              "Edit API"
              :
              "Add API"
          }

          {
            this.props.api ?
              <button
                onClick={ this.props.newAPI }
                className="btn btn-primary pull-right"
              >
                <i className="fa fa-plus"></i>
              </button>
              :
              null
          }
        </h2>

        <form
          className="form-horizontal api-form__form"
          onSubmit={ this.submit }
        >
          <div className="form-group">
            <label htmlFor="" className="col-md-2 control-label">
              API Path
            </label>
            <div className="col-md-10">
               <input
                defaultValue={ api.path }
                required={ true }
                pattern="/.+"
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
                defaultValue={ api.method }
                ref="method"
                className="form-control"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor=""
              className="col-md-2 control-label"
            >
              Content Type
            </label>
            <div className="col-md-10">
              <select
                defaultValue={ api.contentType }
                ref="contentType"
                className="form-control"
              >
                <option value="application/json">JSON</option>
                <option value="text/plain">Plain</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor=""
              className="col-md-2 control-label"
            >
              Body
            </label>
            <div
              className="col-md-10 api-form__editor"
              ref="textarea"
            >
            </div>
          </div>


          <div className="api-form__buttons">
            <button className="btn btn-primary">
              {
                this.props.api ?
                  "Update"
                  :
                  "Add"
              }
            </button>
          </div>
        </form>
      </main>
    )
  },
})

const APIList = React.createClass({
  propTypes: {
    apis: PropTypes.array,
    api: PropTypes.object,
  },

  renderAPIs() {
    return this.props.apis.map((api, index) => {
      const klass = api === this.props.api ? "api-list__item--active" : ""
      return (
        <li
          className={ "list-group-item api-list__item " + klass }
          key={ api.path }
          onClick={ () => this.props.setCurrentAPI(api) }
        >
          { api.path }

          <i
            className="fa fa-remove"
            onClick={ () => this.props.deleteAPI(index) }
          />
        </li>
      )
    })
  },

  render() {
    return (
      <div className="api-list">
        <h2>API List</h2>
        {
          this.props.apis ?
            <div className="api-list__content list-group">
              { this.renderAPIs() }
            </div>
            :
            null
        }
      </div>
    )
  },
})

DOM.render(<App />, document.getElementById("app-container"))
