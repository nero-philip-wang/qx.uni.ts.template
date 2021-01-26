/**
 * 分享主要有一下几种形式：
 * - 生成小程序码【code】
 * - 分享的聊天对话【chat】
 */
import store from '@/store'
import longEncoder from './longEncoder'
import apis from '@/apis/'

const homepage = 'pages/index/index'

const share = {
  /**
   * 从传入参数中获取分享页面path、页面id、分享人id、token
   */
  getInfo() {
    const info = wx.getLaunchOptionsSync()
    switch (info.scene) {
      case 1007: // 【可以通过home中转】单人聊天会话中的小程序消息卡片
      case 1008: {
        // 【可以通过home中转】群聊会话中的小程序消息卡片
        const params = info.query
        if (params.sourceId) store.commit('SET_SOURCE', params.sourceId)
        if (params.token) store.commit('SET_TOKEN', params.token)
        return {
          sourceId: params.sourceId || '',
          token: params.token || '',
          path: decodeURIComponent(params.path || ''),
        }
      }
      case 1037: // 【可以通过home中转】小程序打开小程序
      case 1038: {
        // 【可以通过home中转】从另一个小程序返回
        const params = info.referrerInfo.extraData
        if (params.sourceId) store.commit('SET_SOURCE', params.sourceId)
        if (params.token) store.commit('SET_TOKEN', params.token)
        return {
          sourceId: params.sourceId,
          token: params.token,
          path: decodeURIComponent(params.path),
        }
      }
      case 1047: // 【不可通过home中转】扫描小程序码
      case 1048: // 【不可通过home中转】长按图片识别小程序码
      case 1049: {
        // 【不可通过home中转】扫描手机相册中选取的小程序码
        const arr = longEncoder.decode(decodeURIComponent(info.query.scene))
        console.log(arr)
        const sourceId = arr[0].toString()
        const id = arr[1].toString()
        if (sourceId) store.commit('SET_SOURCE', sourceId)
        return { id, sourceId }
      }
      default:
        return {
          sourceId: '',
          token: '',
          path: '',
        }
    }
  },
  /**
   * 设置页面分享信息
   */
  setInfo(
    { title, imageUrl, page, id, sourceId, token } = { title: '', imageUrl: '', page: '', id: '', sourceId: '', token: false },
    mode = 'chat'
  ) {
    let defaultInfo = {}
    const pages = getCurrentPages()
    if (pages.length) {
      const currentPage = pages[pages.length <= 1 ? 0 : pages.length - 1]
      defaultInfo.page = currentPage ? currentPage.route : homepage
      defaultInfo.id = currentPage.options.id
      if (!page) page = defaultInfo.page
      if (!id) id = defaultInfo.id || 0
      if (!sourceId) sourceId = store.state.user.userId || 0
      if (token) token = store.state.user.token
      if (mode == 'chat') {
        let path = `pages/index/home?href=${page}&sourceId=${sourceId}`
        if (id) path = path + `&id=${id}`
        if (token) path = path + `&token=${token}`
        return {
          title: title || '',
          path: path || '',
          imageUrl: imageUrl || '',
        }
      } else if (mode == 'code') {
        return {
          page: page || homepage,
          scene: longEncoder.encode([sourceId, id]),
        }
      }
    }
  },
  /**
   * 全局混入的通用分享模块
   */
  common: {
    onShow() {
      // 设置默认的转发参数
      this.setShare()
    },
    onShareAppMessage() {
      return this.$u.mpShare
    },
    // #ifdef MP-WEIXIN
    onShareTimeline() {
      return this.$u.mpShare
    },
    // #endif
    methods: {
      /**
       * 设置分享卡片信息
       */
      setShare() {
        this.$u.mpShare = share.setInfo()
      },
      /**
       * 获取分享的小程序码
       */
      async getWxaCode() {
        let { page, scene } = share.setInfo({}, 'code')
        return await apis.cloudapi.getUnlimited({ page, scene })
      },
    },
  },
}
export default share
