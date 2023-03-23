/** 第三方库，交互，文件，色彩转换 */
var inquirer = require('inquirer')
var fs = require('fs')
var Colr = require('colr')
var Process = require('child_process')
const { exit } = require('process')

/** 各个商户配置文件 */
var config = require('../src/config/appList')
/** 项目manifest */
var manifest = require('../src/manifest.json')

/** 文件路径 */
const manifestPath = './src/manifest.json'
const locationPath = './src/apis/modules/location'
const uniscss = './scripts/uni.scss'
const destscss = './src/uni.scss'

async function main() {
  var appid = await getAppId()
  modifyManifest(appid)
  modityCss(appid)
  modifyLocation(appid)
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

function modifyManifest(appid) {
  manifest.name = config[appid].title
  manifest['mp-weixin'].appid = appid
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
}

function modityCss(appid) {
  var colorHex = config[appid].primaryColor
  var hsb = Colr.fromHex(colorHex).toHsvArray()

  var css = fs.readFileSync(uniscss, { encoding: 'utf-8' })
  css = css.replace('$p1', colorHex)
  css = css.replace('$p2', Colr.fromHsv(hsb[0], hsb[1], hsb[2] * 0.9).toHex())
  css = css.replace('$p3', Colr.fromHsv(hsb[0], hsb[1] * 0.4, hsb[2]).toHex())
  css = css.replace('$p4', Colr.fromHsv(hsb[0], hsb[1] * 0.1, hsb[2] * 1.4 < 100 ? hsb[2] * 1.4 : 100).toHex())
  fs.writeFileSync(destscss, css)
}

function modifyLocation(appid) {
  var hasLocation = config[appid].hasGpsOnce
  if (!hasLocation) fs.writeFileSync(locationPath, 'export const getCity2 = () => null')
}

function build() {
  var cmd = `start yarn dev:mp-weixin`
  Process.exec(cmd)
}

function runWx() {
  setTimeout(() => {
    var cmd = `cli.bat open --project ${process.cwd()}\\dist\\dev\\mp-weixin`
    console.log(cmd)
    Process.exec(cmd)
    setTimeout(() => {
      exit()
    }, 2000)
  }, 1000 * 26)
}

main()
