import store from '@/store'
const envVersion = process.env.VUE_APP_BASE_API === 'production' ? '' : 'trial'
const tabUrlList = store.getters.tabbars.map((c) => c.pagePath)
const defaultPage = '/pages/index/index'
const webview = '/pages/webview/index?src='
const navFunc = { push: uni.navigateTo, replace: uni.redirectTo, reLaunch: uni.reLaunch }
/**
 * 通用多功能导航 api，
 *  - 支持 http 协议跳转
 *  - 调程序跳转
 *  - navigateBack（url 传 back）
 *  - 支持跳转到首页 tabbar
 * @param {*} url
 * @param {*} way :[push,replace,reLaunch]
 */
function goto(url, { way, appid } = { way: 'push', appid: null }) {
  const isTabBar = tabUrlList.some((item) => {
    return url.toLocaleLowerCase().indexOf(item) > -1
  })
  const nav = navFunc[way]

  if (url && url[0] !== '/') url = '/' + url
  // 如果是http的链接
  if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) url = webview + encodeURIComponent(url)

  // 跳转小程序
  if (appid) {
    wx.navigateToMiniProgram({
      appId: appid,
      path: url,
      envVersion,
    })
  }
  // 小程序内部
  else {
    // 一般页面
    if (isNaN(url)) {
      // 跳转到首页
      if (url == defaultPage) uni.reLaunch({ url })
      // 底部tabbar
      else if (isTabBar) uni.switchTab({ url })
      // 其他页面
      else nav({ url })
    }
    // 后退
    else if (url < 0) {
      uni.navigateBack({
        delta: url,
      })
    }
  }
}

export default goto
