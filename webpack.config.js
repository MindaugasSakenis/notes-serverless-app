const ZipPlugin = require("zip-webpack-plugin");
const path = require("path");

const config = {
  entry: {
    getNotes: "./Lambdas/getNotes/index.ts",
  },
  output: {
    filename: "[name]/index.js",
    path: path.resolve(__dirname, "dist/"),
    libraryTarget: "umd",
  },
  target: "node",
  mode: "development",
  optimization: { minimize: false },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
const pluginConfig = {
  plugins: Object.keys(config.entry).map((entryName) => {
    return new ZipPlugin({
      path: path.resolve(__dirname, "dist/"),
      filename: entryName,
      extension: "zip",
      include: [entryName],
    });
  }),
};
const webpackConfig = Object.assign(config, pluginConfig);
module.exports = webpackConfig;
