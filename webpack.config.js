const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  entry: {
    main: path.resolve("./src/web-client/main.tsx"),
  },
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve("./build"),
    filename: "[name].js",
    publicPath: "/",
    globalObject: "this", // https://github.com/webpack/webpack/issues/6642
  },
  resolve: {
    modules: ["./src/web-client", "node_modules"],
    extensions: ["*", ".ts", ".js", ".jsx", ".json", ".tsx"],
  },
  // externals: project.externals,
  module: {
    rules: [
      {
        test: /shared-worker\.js$/,
        use: {
          loader: "worker-loader",
          options: {
            filename: "shared-worker.js",
            worker: "SharedWorker",
          },
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-proposal-class-properties",
              ],
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
      {
        test: /\.(css|sass|scss)/,
        use: [{ loader: "css-loader" }],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: { limit: 20000 },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/web-client/index.html",
      inject: true,
      minify: { collapseWhitespace: true },
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/web-client/styles.css", to: "./styles.css" },
        // {from: './src/web-client/shared-worker.js', to: './shared-worker.js' }
      ],
    }),
  ],
};

module.exports = config;
