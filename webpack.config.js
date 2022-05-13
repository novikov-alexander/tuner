// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkerUrlPlugin = require('worker-url/plugin');

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.html",
    }),
    new WorkerUrlPlugin(),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader"
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      }
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: { 
      "path": require.resolve("path-browserify"),
      "fs": require.resolve("browserify-fs"),
      "buffer": require.resolve("buffer"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util")
    }
  },
};

if (isProduction) {
  config.mode = "production";
} else {
  config.mode = "development";
}

const appConfig = {
  ...config,
  entry: {
    bundle: "./app/app.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
  },
  dependencies: ["frequency-processor-worklet"],
  devServer: {
    open: true,
    host: "localhost"
  },
}

const processorConfig = {
  ...config,
  name: "frequency-processor-worklet",
  entry: "./app/frequency-processor.js",
  target: "webworker",
  output: { 
    filename: "frequency-processor-worklet.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    globalObject: 'this'
  }
}

module.exports = [
  processorConfig,
  appConfig
]