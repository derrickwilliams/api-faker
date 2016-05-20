/*
* @Author: dingxijin
* @Date:   2016-05-10 17:23:00
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-18 15:06:37
*/

var webpack = require("webpack")
var path = require("path")
var isProduction = process.env.NODE_ENV == "production"

module.exports = {
  devtool: isProduction ? "cheap-module-source-map" : "eval",
  entry: "./app.jsx",
  output: {
    path: path.join(__dirname, "../static"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: ["", ".jsx", ".js", ".css", ".styl"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel?presets[]=es2015&presets[]=react",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: "style!css",
        exclude: /node_modules/,
      },
      {
        test: /\.styl$/,
        loader: "style!css!stylus",
        exclude: /node_modules/,
      },
    ],
  },
}
