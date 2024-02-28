// See https://github.com/saisandeepvaddi/web-extension-communication-blog-post for webpack and babel configs
// ** as well as messaging.ts and types.ts

// See https://stackoverflow.com/questions/70615305/hot-live-reloading-for-react-chrome-extension for how to hot reload
// local development with webpack-dev-server

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

let entry = {};

require("fs")
  .readdirSync("src")
  .forEach((file) => {
    const p = path.parse(file);
    if (p.ext === ".ts") {
      entry[p.name] = path.resolve("src", file);
    }
  });

module.exports = {
  mode: 'development',
  watch: true,
  entry,
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
      }, {
        from: 'static'
      }],
    }),
  ],
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
}