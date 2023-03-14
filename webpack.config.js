const path = require('path');

module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  entry: {
    main: "./main.ts",
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: "main-bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".ts", ".js", ".d.ts", ".png"],
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|otf|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1000
          }
        }]
      }
    ]
  }
};