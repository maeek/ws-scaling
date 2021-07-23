const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
  entry: path.resolve('./src/web-client/main.ts'),
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve('./build'),
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    modules: ['./src/web-client', 'node_modules'],
    extensions: ['*', '.ts', '.js', '.jsx', '.json', '.tsx']
  },
  // externals: project.externals,
  module: { rules: [] },
  plugins: []
};

// JavaScript
// ------------------------------------
config.module.rules.push({
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        plugins: [
          '@babel/plugin-transform-runtime'
        ],
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript'
        ]
      }
    }
  ]
});


config.module.rules.push({
  test: /\.(css|sass|scss)/,
  use: [
    { loader: 'css-loader' }
  ]
});

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif|svg)$/,
  loader: 'url-loader',
  options: { limit: 8192 }
});

config.plugins.push(
  new HtmlWebpackPlugin({
    template: './src/web-client/index.html',
    inject: true,
    minify: { collapseWhitespace: true }
  })
);

config.plugins.push(new CopyPlugin({
  patterns: [
    {from: './src/web-client/styles.css', to: './styles.css' }
  ]
}))

module.exports = config;
