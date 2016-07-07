'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const autoprefixer = require('autoprefixer');

const pluginsProd = [
  new ExtractTextPlugin('style.css', {allChunks: true}),
  new HtmlWebpackPlugin({template: 'jade!./src/index.jade'}),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
];

const pluginsDev = [
  new HtmlWebpackPlugin({template: './src/index.jade'}),
  new webpack.HotModuleReplacementPlugin(),
  new ExtractTextPlugin('style.css', {allChunks: true}),
  new CopyWebpackPlugin([
    { from: './src/data.json', to: './' },
    { from: './src/assets', to: './assets' }
  ])
];

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = {
  watch: isDevelopment,
  devtool: isDevelopment ? 'source-map' : null,
  entry: [
    './src/index.js'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/'
  },

  plugins: isDevelopment ? pluginsDev : pluginsProd,
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?presets[]=es2015']},
      {test: /\.jade/, exclude: /node_modules/, loader: 'jade-loader'},
      {test: /\.styl/, loader: ExtractTextPlugin.extract(['css', 'postcss', 'stylus?sourceMap'])}
    ]
  },

  postcss: [autoprefixer({browsers: ['ie >= 10', 'opera >= 12']})]
};
