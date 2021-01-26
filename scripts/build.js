var exec = require('child_process').exec
var cmd = `cross-env NODE_ENV=production UNI_PLATFORM=mp-weixin VUE_APP_T=${process.argv[2]} vue-cli-service uni-build`

var config = require('../src/config/tenant')
var appId = config[process.argv[2]].appId
console.log(appId)

const fs = require('fs')
const path = './src/manifest.json'
fs.readFile(path, function(err, data) {
  if (err) {
    console.log(err)
  } else {
    let settings = data.toString()
    settings = JSON.parse(settings)
    settings['mp-weixin'].appid = appId
    fs.writeFile(path, JSON.stringify(settings,null, 2), function(err) {
      if (err) {
        console.error(err)
      } else {
        console.log('修改manifest成功')
      }
    })
  }
})

exec(cmd, function(error, stdout, stderr) {
  console.log(stdout)
  console.log(error)
  console.log(stderr)
})
