// note: we need to disable autoprefixer in css-loader by `css-autoprefixer`

var webpack = require("webpack")
var path = require("path")
var devConfig = require("./webpack.config.js")
var vendorsManifest = require("./_dist/vendors-manifest.json")
var fileUtils = require("./file-utils.js")

module.exports = {
  devtool: "cheap-module-source-map",
  entry: {
    app: "./src/entry.jsx",
  },
  output: {
    path: path.join(__dirname, "_dist"),
    filename: "[name].bundle.[chunkhash].js",
    chunkFilename: "[name].chunk.[chunkhash].js",
  },
  resolve: devConfig.resolve,
  plugins: [
    new webpack.DefinePlugin({
      "__DEV__": false,
      "process.env": {
        "NODE_ENV": JSON.stringify("production"),
      },
    }),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname),
      manifest: vendorsManifest,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    function() {
      this.plugin("done", function(stats) {
        if (stats.toJson().errors.length === 0) {
          fileUtils.copyFile("html/index.html", "_dist/index.html")
          var assets = stats.toJson().assetsByChunkName
          var appName = assets.app[0]
          var vendorsHash = vendorsManifest.name.split("_")[1]
          fileUtils.replaceInFile("_dist/index.html", "<app_js>", appName)
          fileUtils.replaceInFile("_dist/index.html", "<vendors_js>", `vendors.bundle.${vendorsHash}.js`)
        }
      })
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
        loader: "style!css?-autoprefixer!postcss!stylus?paths[]=styles",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: "style!css?-autoprefixer!postcss",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: /node_modules/,
        loader: "url?limit=10000&name=images/[name].[hash].[ext]",
      },
    ],
  },
  postcss() {
    return [require("autoprefixer")]
  },
}
