/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const loaders = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
    }
  }, // 先解析ts和tsx，rule规则从下往上
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {}
      },
      'css-loader'
    ]
  },
  {
    test: /\.less$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-inline-loader'
      }
    ]
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '/static/[name]-[hash].[ext]'
        }
      }
    ]
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '/static/[name]-[hash].[ext]'
        }
      }
    ]
  }
];

const config = {
  resolve: {
    extensions: ['.ts', '.tsx', '.web.js', '.js', '.jsx']
  },
  entry: path.join(__dirname, './index.tsx'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'quill-react-commercial.min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: loaders
  },

  mode: 'production',
  devtool: 'cheap-module-source-map',

  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist']
    }),
    // new webpack.ProvidePlugin({
    //   'window.Quill': 'quill/dist/quill.js',
    //   Quill: 'quill/dist/quill.js'
    // }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'quill-react-commercial.min.css'
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ],

  performance: {
    maxAssetSize: 1000000,
    hints: 'warning'
  }
};

module.exports = config;
