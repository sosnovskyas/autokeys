'use strict';
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js"
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'jade!./src/index.jade'
  })],
  loaders: [
    {test: /\.js$/, loader: 'babel'},
    {test: /\.jade$/, loader: 'jade'}
  ]
}
