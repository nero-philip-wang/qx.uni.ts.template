import config from './appList'
import manifest from '../manifest.json'

const appid = manifest['mp-weixin'].appid
config[appid].install = (Vue) => {
  Vue.prototype.$cfg = config
  const primaryColor = config[appid].primaryColor
  uni.$u.props.checkbox.activeColor = primaryColor
  uni.$u.props.radio.activeColor = primaryColor
  uni.$u.props.tabbar.activeColor = primaryColor
  uni.$u.props.tabs.lineColor = primaryColor
  uni.$u.props.scrollList.indicatorActiveColor = primaryColor
  uni.$u.props.tabs.lineWidth = '50rpx'
}

module.exports = config[appid]
