const path = require("path");
const webpack = require("webpack");

module.exports = {
  // Put your normal webpack config below here
  entry: "./src/render.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "render.prod.js",
  },
  target: "electron11-renderer", // load electron externals
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            exclude: /node_modules/,
          },
        },
      },
      // Put your webpack loader rules in this array.  This is where you would put
      // your ts-loader configuration for instance:
      /**
       * Typescript Example:
       *
       * {
       *   test: /\.tsx?$/,
       *   exclude: /(node_modules|.webpack)/,
       *   loaders: [{
       *     loader: 'ts-loader',
       *     options: {
       *       transpileOnly: true
       *     }
       *   }]
       * }
       */
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      h: ["preact", "h"],
    }),
  ],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
  },
};
