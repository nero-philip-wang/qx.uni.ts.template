import request from '../request'
import config from '@/config'
import store from '@/store'
const SET_TOKEN = (v) => store.commit('SET_TOKEN', v)
const SET_OPENID = (v) => store.commit('SET_OPENID', v)
const SET_MEMBER = (v) => store.commit('SET_MEMBER', v)
export const cache = {
  expire: null,
  session: null,
}

// code 换取 openid
export const loginByCode = async () => {
  var [, res] = await uni.login()
  var { code } = res
  if (res) {
    var response = await request(
      'mall/users/oauth',
      'post',
      { provider: 'WechatMiniProgram', appId: config.appId, code },
      { needLogin: false }
    )
    // 已登录
    if (response.token) {
      SET_TOKEN(response.token)
      SET_MEMBER(response.member)
      SET_OPENID(response.openId)
      return response
    } else {
      SET_OPENID(response.openId)
      cache.session = response
      cache.expire = Date.now() + 10 * 60 * 1000
      return response
    }
  } else {
    uni.showModal({
      title: '微信登录失败',
      showCancel: false,
    })
    return null
  }
}

// 手机授权登录
export const TryBindByMobile = async (data) => {
  if (!data.nickname) data.nickname = '微信用户'
  var response = request('mall/users/oauth/sign', 'POST', { ...data, ...cache.session, sid: store.state.share.mid }, { needLogin: false })
  if (response.token) {
    SET_TOKEN(response.token)
    SET_MEMBER(response.member)
    SET_OPENID(response.openId)
    return response
  } else {
    console.log(response)
    return response
  }
}
