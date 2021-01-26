/** 从url上获取参数 */
const getQueryString = (url, name) => {
  if (!url) {
    return ''
  }
  if (!name) {
    return ''
  }
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const urlSplit = decodeURIComponent(url).split('?')
  if (urlSplit.length < 2) {
    return ''
  }
  const rt = urlSplit[1].match(reg)
  // let searchPart = urlSplit[1].split('#')[0]
  // let rt = searchPart.match(reg)
  return rt ? unescape(rt[2]) : ''
}

/** 检测非法字符 */
const isUnsafeString = (str) => {
  const rule = /^[A-Za-z0-9\u4e00-\u9fa5\-_]+$/ // 合法字符
  return !rule.test(str)
}

/** 小程序更新 */
const updateApp = () => {
  // 版本更新
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      if (res.hasUpdate) {
        // 请求完新版本信息的回调
        updateManager.onUpdateReady(function() {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            },
          })
        })
        updateManager.onUpdateFailed(function() {
          uni.showModal({
            // 新的版本下载失败
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
          })
        })
      }
    })
  } else {
    uni.showModal({
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
    })
  }
}

/** 将对象中所有的iso时间字符串转换为时间类型 */
const obj2timestamp = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] == 'object') obj2timestamp(obj[key])
    else if (
      typeof obj[key] == 'string' &&
      (obj[key].match(/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/) ||
        obj[key].match(/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})Z/))
    ) {
      obj[key] = Date.parse(obj[key])
    }
  }
  return obj
}

/** 删除字符串头部 */
function trimStart(str, char) {
  var nLen = str.length
  var i = 0
  for (var n = 1; n <= nLen; n++) {
    if (str.substr(n - 1, 1) === char) i++
    else break
  }

  return str.substr(i, nLen)
}

/** 删除字符串尾部 */
function trimEnd(str, char) {
  var nLen = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    if (str.substr(i, 1) !== char) break
    else nLen--
  }
  return str.substr(0, nLen)
}

/** 分到元 */
function toYuan(v) {
  var yuan = (v / 100).toFixed(2)
  yuan = trimEnd(yuan, '0')
  yuan = trimEnd(yuan, '.')
  return yuan
}

/** 元到分 */
function toFeng(v) {
  var feng = (v * 100).toFixed(0)
  return feng
}

module.exports = {
  getQueryString,
  isUnsafeString,
  updateApp,
  obj2timestamp,
  trimStart,
  trimEnd,
  toYuan,
  toFeng,
}
