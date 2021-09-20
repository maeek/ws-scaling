const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
  entry: {
    main: path.resolve('./src/web-client/main.tsx')
  },
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve('./build'),
    filename: '[name].js',
    publicPath: '/',
    globalObject: 'this' // https://github.com/webpack/webpack/issues/6642
  },
  resolve: {
    modules: [ './src/web-client', 'node_modules' ],
    extensions: [ '*', '.ts', '.js', '.jsx', '.json', '.tsx' ]
  },
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: [
          {
            loader: 'worker-loader',
            options: {
              worker: 'SharedWorker',
              filename: '[name].js'
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties'
              ],
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react'
              ]
            }
          }
        ]
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules|\.worker\.ts/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties'
              ],
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react'
              ]
            }
          }
        ]
      },
      {
        test: /\.(css|sass|scss)/,
        use: [ { loader: 'css-loader' } ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: { limit: 20000 }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './src/web-client/public')
    },
    compress: true,
    hot: true,
    port: 5000,
    client: {
      overlay: {
        warnings: false
      }
    }
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/web-client/public/index.html',
      inject: true,
      minify: { collapseWhitespace: true }
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/web-client/public/styles.css', to: './styles.css' }
      ]
    })
  ]
};

module.exports = config;
