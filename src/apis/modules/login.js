import tenant from '@/config/current'
import store from '@/store'
import { arequest, goLogin } from '../request'
var loading = false
var tryed = false

export const tryLogin = async () => {
  const token = store.state.user.token

  // 如果有保存过 token
  if (token) return token
  // 如果没有保存 token
  // #ifdef MP-WEIXIN
  // else return await loginByCode()
  else ''
  // #endif
  // #ifdef H5
  //  else return ''
  // #endif
}

export const loginByCode = () => {
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
    } else if (tryed) {
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
                'linker/Sign/TrySignInByOAuth',
                'post',
                {},
                {
                  provider: 'WechatMiniProgram',
                  appId: tenant.appId,
                  code: res.code,
                }
              )
              var reponse = rt.data.data
              var employee = reponse && reponse.extra && reponse.extra.employee
              if (rt.data.code === 200) {
                // 如果获取到了店员信息
                if (employee) {
                  var info = {
                    token: 'Bearer ' + reponse.token,
                    userId: reponse.user.id,
                    title: reponse.user.nickName,
                    avatar: reponse.user.avatar,
                    tenantId: employee.departmentId > 99999999 ? parseInt(employee.departmentId / 10000) : employee.departmentId,
                    shopId: employee.departmentId,
                    employee: employee,
                  }
                  store.commit('SET_USERINFO', info)
                  resolve(info.token)
                } else {
                  // 如果是首次登录，保存sessionkey等信息
                  store.commit('SET_SESSIONINFO', reponse)
                  reject(rt)
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
export const TryBindByMobile = (data) => {
  return arequest('linker/Sign/TryBindByMobile', 'POST', {}, data)
}

// 获取用户加盐
export const salt = (account, data) => {
  return arequest(`default/Common/user/${account}/salt`, 'GET', data)
}

// 通过密码登录
export const loginInByPw = (account, data) => {
  return arequest(`default/Common/user/${account}/loginInByPw`, 'GET', {}, data)
}
