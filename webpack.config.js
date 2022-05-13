// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const partialOptions = {
  optimization: {
    minimize: false
  },
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

const config = {
  entry: {
    bundle: "./app/app.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.html",
    }),
  ],
  ...partialOptions
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }

  return [
    {
      name: "webworker",
      mode: "production",
      target: "webworker",
      entry: "./app/frequency-processor.ts",
      output: {
        filename: "webworker.min.js",
        path: path.resolve("./app")
      },
      ...partialOptions
    },
    {
      name: "app",
      dependencies: ["webworker"],
      ...config
    }
  ];
};
