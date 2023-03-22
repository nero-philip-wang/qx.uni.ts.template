import tenant from '../config'
import store from '@/store'
import goto from '@/utils/goto'
import md5 from 'md5'
import qs from 'qs'
var loadding = false

export const goLogin = function() {
  goto('/pages/login/login', { way: 'replace' })
}

const ajax = async (url, method = 'get', headers = {}, params = {}) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('请求路径为空'))
    }
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
    var query = ''
    if (method == 'get') {
      query = '?' + qs.stringify(params, { arrayFormat: 'repeat' })
      params = null
    }

    uni.request({
      url: process.env.VUE_APP_BASE_API + 'api/v1.0/' + url + query,
      data: params,
      header: headers,
      method: method,
      success: async (rt) => {
        if (rt.statusCode == 200 || rt.statusCode == 404) {
          resolve(rt.data)
        } else {
          reject(rt)
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

const setHeaders = (headers = {}) => {
  // 签名
  const nonce = Math.random()
  const stamp = Math.round(Date.now() / 1000)
  const tempStr = `${tenant.appId}${stamp}${nonce}${tenant.key}`
  const sign = md5(tempStr)

  var result = {
    'Accept-Language': 'zh-CN',
    AppId: tenant.appId,
    Nonce: nonce,
    Stamp: stamp,
    Sign: sign,
    ShopId: store.state.share.sid || '',
    TenantId: store.state.share.tid || '',
    Authorization: store.state.user.token,
  }
  result = Object.assign({}, result, headers)

  return result
}

export const request = async (
  url,
  method = 'get',
  params = {},
  { needLogin, showError, autoLogin } = { needLogin: false, showError: true, autoLogin: true },
  headers = {}
) => {
  var errMessage = null
  var token = store.state.user.token
  // 需要登录但是没有token
  if (needLogin && !token) {
    if (autoLogin) {
      await goLogin()
      return
    } else {
      errMessage = '请先登录'
      return
    }
  }
  // 删除空参数
  for (var key in params) {
    if (params[key] === undefined || params[key] === null) {
      delete params[key]
    }
  }
  // 准备headers
  var headers2 = setHeaders(headers)

  try {
    var result = await ajax(url, method, headers2, params)
    return result.data
  } catch (error) {
    const statusCode = error.statusCode
    switch (statusCode) {
      case 401:
      case 403:
        // 清除过期登录信息
        store.commit('RESET_USER')
        if (autoLogin) {
          await goLogin()
          return
        } else {
          errMessage = '登录信息过期，请重新登录'
          break
        }
      default:
        if (statusCode < 500 && statusCode >= 400) {
          errMessage = error.data.msg || error.data.message || ''
        } else {
          errMessage = '活动太火爆了 请稍后重试'
        }
    }

    // if (error.message == 'ok' || error.message == 'Ok') errMessage = '网络不佳 请重试'
    // else errMessage = '网络不佳 请重试' || error.message
  } finally {
    if (errMessage && showError) {
      uni.showModal({
        title: '',
        showCancel: false,
        content: errMessage,
      })
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMessage)
    }
  }
}

export default request
