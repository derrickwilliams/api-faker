/*
* @Author: dingxijin
* @Date:   2016-05-10 17:54:45
* @Last Modified by:   dingxijin
* @Last Modified time: 2016-05-10 18:01:35
*/

import "./style"
import React, { PropTypes } from "react"

export default React.createClass({
  propTypes: {
    text: PropTypes.string,
  },

  getDefaultProps() {
    return {
      text: "加载中...",
    }
  },

  render() {
    return (
      <div className="_loading">
        <div className="uil-ring-css _loading__item">
          <div></div>
        </div>

        <p className="_loading__text">
          { this.props.text }
        </p>
      </div>
    )
  },
})
