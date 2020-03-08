/**
 * 按需打包antd
 */
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override (

  //针对antd实现按需打包: 根据import打包(使用babel-plugin-import)
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true // 自动打包相关样式
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' } //配置默认主题颜色为绿色
  })
)