var inquirer = require('inquirer')
var fs = require('fs')
var config = require('../src/config/appList')
var manifest = require('../src/manifest.json')
const manifestPath = './src/manifest.json'
const appPath = './src/App.vue'

async function main() {
  console.log()
  var appid = await getAppId()
  await modManifest(appid)
  await modApp(appid)
  build()
  runWx()
}

async function getAppId() {
  var configList = []
  for (const key in config) {
    configList.push({
      name: config[key].appId + ' ' + config[key].title,
      value: config[key].appId,
    })
  }

  const { selectedAppid } = await inquirer.prompt([
    {
      name: 'selectedAppid',
      type: 'list',
      message: '请选择发布的appid',
      choices: configList,
    },
  ])
  return selectedAppid
}

function modManifest(appid) {
  return new Promise((resolve, reject) => {
    manifest.name = config[appid].title
    manifest['mp-weixin'].appid = appid
    fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), (err) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log('修改manifest成功')
        resolve()
      }
    })
  })
}
function modApp(appid) {
  return new Promise((resolve, reject) => {
    var hasLocation = config[appid].hasGpsOnce

    fs.readFile(appPath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        var hasLocationString = '@/apis/modules/location'
        var noLocationString = '@/apis/modules/nolocation'
        var targetString = hasLocation ? hasLocationString : noLocationString
        data = data.replace(hasLocationString, targetString)
        data = data.replace(noLocationString, targetString)

        fs.writeFile(appPath, data, (err) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            console.log('修改App.vue成功')
            resolve()
          }
        })
      }
    })
  })
}

function build() {
  var cmd = `start yarn build:mp-weixin`
  var exec = require('child_process').exec
  console.log('开始编译')
  exec(cmd, function(error, stdout, stderr) {
    console.log(stdout)
    console.log(error)
    console.log(stderr)
  })
}

function runWx() {
  setTimeout(() => {
    var cmd = `cli.bat open --project ${process.cwd()}\\dist\\build\\mp-weixin`
    var exec = require('child_process').exec
    exec(cmd, function(error, stdout, stderr) {
      console.log(stdout)
      console.log(error)
      console.log(stderr)
    })
  }, 1000 * 26)
}

main()
