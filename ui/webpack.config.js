var webpack = require("webpack")
var path = require("path")
var fileUtils = require("./file-utils.js")

module.exports = {
  devtool: "eval",
  entry: "./src/entry.jsx",
  output: {
    path: path.join(__dirname, "_dev"),
    filename: "app.bundle.js",
  },
  resolve: {
    root: [
      path.join(__dirname, "src"),
      path.join(__dirname),
    ],
    extensions: ["", ".jsx", ".js", ".styl", ".css"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "__DEV__": true,
      "__HOST__": JSON.stringify("http://localhost:9101"),
      "process.env": {
        "NODE_ENV": JSON.stringify("development"),
      },
    }),
    function() {
      fileUtils.copyFile("html/index.dev.html", "_dev/index.html")
    },
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {
          presets: ["react", "es2015"],
        },
      },
      {
        test: /\.styl$/,
        loader: "style!css!stylus?paths[]=styles",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: "style!css",
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
        loader: "url?limit=10000&name=images/[name].[hash].[ext]",
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?.*)?$/,
        loader: "url?limit=10000&name=fonts/[name].[hash].[ext]",
      },
    ],
  },
}
