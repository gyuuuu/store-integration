// var path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: "http://localhost:3000/store-integration"
  }
};
