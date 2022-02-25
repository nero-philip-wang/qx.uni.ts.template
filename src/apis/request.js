import tenant from '../config'
import store from '@/store'
import md5 from 'md5'
import { tryLogin } from './modules/login'

var loadding = false

export const goLogin = function() {
  return new Promise((resolve) => {
    const pageList = getCurrentPages()

    const pageThis = pageList[pageList.length <= 1 ? 0 : pageList.length - 1]
    let pageRoute = pageThis ? pageThis.route : 'pages/index/index'
    if (pageRoute.indexOf('pages/login/login') != -1) return
    const pageOptionsKeys = pageThis ? Object.keys(pageThis.options) : []
    let optionsStr = ''
    pageOptionsKeys.map(function(item) {
      optionsStr += '&' + item + '=' + pageThis.options[item]
    })
    optionsStr = optionsStr.length > 0 ? '?' + optionsStr.substring(1) : ''
    pageRoute = encodeURIComponent('/' + pageRoute + optionsStr)
    uni.navigateTo({
      url: '/pages/login/login?href=' + pageRoute,
    })
    resolve()
  })
}

export const arequest = async (url, method = 'get', headers = {}, params = {}) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('请求路径为空'))
    }
    // 签名
    const nonce = Math.random()
    const stamp = Math.round(Date.now() / 1000)
    const tempStr = `${tenant.appId}${stamp}${nonce}${tenant.key}`
    const sign = md5(tempStr)

    // 延时200ms弹出加载框
    setTimeout(() => {
      if (loadding) {
        uni.showLoading({
          title: '正在加载...',
        })
      }
    }, 200)

    // 请求开始
    loadding = true
    uni.request({
      url: process.env.VUE_APP_BASE_API + 'api/v1.0/' + url,
      data: params,
      header: {
        AppId: tenant.appId,
        Nonce: nonce,
        Stamp: stamp,
        Sign: sign,
        TenantId: store.state.user.tId,
        'Accept-Language': 'zh-CN',
        ...headers,
      },
      method: method,
      success: async (rt) => {
        if (rt.data.code == 500 || rt.data.code == 400) {
          reject(rt.data)
        } else {
          resolve(rt)
        }
      },
      fail: (rt) => {
        reject(rt)
      },
      complete: () => {
        loadding = false
        uni.hideLoading()
      },
    })
  })
}

export const request = async (
  url,
  method = 'get',
  params = {},
  { showError, autoLogin } = {
    showError: true,
    autoLogin: true,
  }
) => {
  var token = await tryLogin()
  var headers = {
    TenantId: store.state.user.tId,
    ShopId: store.state.user.shopId || store.state.user.tenantId,
    Authorization: token,
  }

  for (var key in params) {
    if (params[key] === undefined || params[key] === null) {
      delete params[key]
    }
  }

  var errMessage = null
  try {
    var rt = await arequest(url, method, headers, params)
    const statusCode = rt.statusCode
    switch (statusCode) {
      case 401:
      case 403:
        if (autoLogin) {
          await goLogin()
          return
        } else {
          errMessage = '登录信息过期，请重新登录'
          break
        }
      case 200:
      case 404:
        return rt.data.data
      default:
        wx.reportAnalytics('onerror', {
          url,
          params,
          code: statusCode,
          msg: errMessage,
        })
        if (statusCode < 500 && statusCode >= 400) {
          errMessage = rt.data.msg || rt.data.message || ''
        } else {
          errMessage = '活动太火爆了 请稍后重试'
        }
    }
  } catch (error) {
    if (error.message == 'ok' || error.message == 'Ok') errMessage = '网络不佳 请重试'
    else errMessage = '网络不佳 请重试' || error.message
  } finally {
    if (errMessage) {
      if (showError) {
        uni.showModal({
          title: '',
          showCancel: false,
          content: errMessage,
        })
        // eslint-disable-next-line no-unsafe-finally
        throw new Error(errMessage)
      } else {
        // eslint-disable-next-line no-unsafe-finally
        throw new Error(errMessage)
      }
    }
  }
}

export default request
