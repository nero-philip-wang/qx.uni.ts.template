// 你不需要 `import app from './modules/app'`,它将自动要求所有vuex模块从模块文件
// it will auto require all vuex module from modules file
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value
  return modules
}, {})
export default modules
