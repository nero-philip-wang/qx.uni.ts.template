import tenant from '@/config'
import store from '@/store'
import { arequest, goLogin } from '../request'
var loading = false
var tryed = false

export const reset = () => (tryed = false)
export const tryLogin = async () => {
  const token = store.state.user.logged.token
  // 如果有保存过 token
  if (token) return token
  // 如果没有保存 token
  // #ifdef MP-WEIXIN
  // 朋友圈
  else if (wx.getLaunchOptionsSync().scene == 1154) return ''
  else return await loginByCode()
  // else ''
  // #endif
  // #ifdef H5
  //  else return ''
  // #endif
}

export const loginByCode = (force = false) => {
  return new Promise((resolve, reject) => {
    // 如果上一个请求还在进行中，那么等待上一个请求的结果,等到20次没有结果就失败
    var times = 0
    if (loading) {
      console.log('loading')
      setInterval(() => {
        // if (store.state.user.token) resolve(store.state.user.token)
        // if (++times > 20) reject(new Error('请求超时'))
        if (!loading) resolve(store.state.user.token)
      }, 200)
    } else if (tryed && force == false) {
      console.log('tryed')
      resolve('')
    } else {
      loading = true
      console.log('尝试通过code登录')
      // 尝试通过code登录
      wx.login({
        success: async (res) => {
          if (res.code) {
            try {
              var rt = await arequest(
                'mall/users/oauth',
                'post',
                {},
                {
                  provider: 'WechatMiniProgram',
                  appId: tenant.appId,
                  code: res.code,
                }
              )
              var reponse = rt.data.data || null
              var { member } = reponse || {}
              if (reponse) {
                // 如果获取到了会员信息
                if (member) {
                  store.commit('SET_USERINFO', {
                    ...member,
                    token: 'Bearer ' + reponse.token,
                    openId: reponse.openId,
                  })
                  if (member.bindingMemberId && !store.state.user.sId) store.commit('SET_SOURCE', member.bindingMemberId)
                  resolve(member)
                } else {
                  // 如果是首次登录，保存sessionkey等信息
                  reject(reponse)
                }
              } else {
                // 如果名下没有工作的店铺
                uni.showModal({
                  title: '请联系您的总部',
                  showCancel: false,
                  content: rt.data.message,
                })
                store.commit('SET_NOT_EMPLOYEE', false)
                reject(rt)
              }
            } finally {
              loading = false
              tryed = true
            }
          }
        },
      })
    }
  })
}

// 手机授权登录
export const TryBindByMobile = async (data) => {
  var rt = await arequest('mall/users/oauth/sign', 'POST', {}, { ...data, sid: store.getters.sid })
  var reponse = rt.data.data
  var member = reponse && reponse.member
  if (rt.data.message === 'ok') {
    // 如果获取到了会员信息
    if (member) {
      store.commit('SET_USERINFO', {
        ...member,
        token: 'Bearer ' + reponse.token,
        openId: reponse.openId,
      })
      return reponse.token
    } else {
      // 如果是首次登录，保存sessionkey等信息
      throw reponse
    }
  } else {
    throw reponse
  }
}

// 获取用户加盐
export const salt = (account, data) => {
  return arequest(`default/Common/user/${account}/salt`, 'GET', data)
}

// 通过密码登录
export const loginInByPw = (account, data) => {
  return arequest(`default/Common/user/${account}/loginInByPw`, 'GET', {}, data)
}
