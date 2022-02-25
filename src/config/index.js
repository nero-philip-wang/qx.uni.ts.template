import config from './appList'
import manifest from '../manifest.json'

const appid = manifest['mp-weixin'].appid
module.exports = config[appid]
