const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const Autoprefixer = require("autoprefixer");

module.exports = {
  entry: {
    sass: "./assets/index.scss",
    js: "./assets/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 1,
              url: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [Autoprefixer],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                sourceMap: true,
                importer: globImporter(),
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.js$/,
        loader: "string-replace-loader",
        options: {
          search: "@popperjs/core",
          replace: "../../../popper",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: "./dist/sass.css", destination: "./style.css" },
            { source: "./dist/js.js", destination: "./scripts.js" },
            // Move packages frome node_modules to package folder, because node_modules doesn't get deployed to front end
            // { source: "./node_modules/packageName", destination: "./assets/packages/packageFolder"},
          ],
        },
      },
    }),
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      proxy: "http://homestead.local/",
    }),
    new webpack.BannerPlugin({
      banner: `
        /* 
            Theme Name: Homestead
            Theme URI: https://github.com/djbatt/homestead
            Description: Homestead is a child theme of Hello Elementor developed by David Battiston
            Author: David Battiston
            Author URI: https://davidbattiston.com/
            Template: hello-elementor
            Version: 1.0.1
            Text Domain: Homestead
            License: GNU General Public License v3 or later.
            License URI: https://www.gnu.org/licenses/gpl-3.0.html
            Tags: flexible-header, custom-colors, custom-menu, custom-logo, editor-style, featured-images, rtl-language-support, threaded-comments, translation-ready
        */
      `,
    }),
  ],
  optimization: {
    minimize: true,
  },
  cache: {
    type: "filesystem",
  },
};
