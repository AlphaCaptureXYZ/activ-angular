const dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      // "crypto": false,
      // "zlib": false,
      buffer: require.resolve("buffer"),
    },
  },
  node: { global: true },
  output: {
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        loader: "less-loader",
        options: {
          modifyVars: {
            "primary-color": "#1a1a1a",
            "link-color": "#1a1a1a",
            "border-radius-base": "2px",
          },
          javascriptEnabled: true,
        },
      },
      {
        test: /\.html$/,
        use: "raw-loader",
      },
      {
        test: /\.txt$/,
        use: "raw-loader",
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new dotenv({
      systemvars: true,
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
        case "buffer":
          resource.request = "buffer";
          break;
        // default:
        //   throw new Error(`Not found ${mod}`);
      }
    }),
  ],
};
