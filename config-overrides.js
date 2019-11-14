const { override, fixBabelImports } = require("customize-cra");

//更改打包是图片加载模式，解决electron打包后图片无法加载问题
const customizeImageLoader = () => config => {
  config.module.rules[2].oneOf.push({
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: "file-loader"
  });
  return config;
};
module.exports = override(
  customizeImageLoader(),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css"
  })
);
