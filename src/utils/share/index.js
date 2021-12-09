/**
 * 分享主要有一下几种形式：
 * - 生成小程序码【code】
 * - 分享的聊天对话【chat】
 */
import store from '@/store'
import apis from '@/apis/'

const homepage = 'pages/index/index'
const transpage = 'pages/index/home'

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
        // const params = info.referrerInfo.extraData
        // if (params.sourceId) store.commit('SET_SOURCE', params.sourceId)
        // if (params.token) store.commit('SET_TOKEN', params.token)
        // return {
        //   sourceId: params.sourceId,
        //   token: params.token,
        //   path: decodeURIComponent(params.path),
        // }
        return {}
      }
      case 1047: // 【通过home中转】扫描小程序码
      case 1048: // 【通过home中转】长按图片识别小程序码
      case 1049: {
        // 【通过home中转】扫描手机相册中选取的小程序码
        const scene = info.query.scene
        // 通过 scene 兑换原始信息
        const params = { scene }
        if (sourceId) store.commit('SET_SOURCE', params.sId)
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
  generateInfo({ title, imageUrl, page, id, sId, tId, tTitle } = { title: '', imageUrl: '', page: '', id: '', sId: '' }, mode = 'chat') {
    const pages = getCurrentPages()
    if (pages.length) {
      // 设置默认分享信息
      const defaultInfo = {}
      const currentPage = pages[pages.length <= 1 ? 0 : pages.length - 1]
      defaultInfo.page = currentPage ? currentPage.route : homepage
      defaultInfo.id = currentPage.options.id
      defaultInfo.sId = store.state.user.sId
      defaultInfo.tId = store.state.user.tId
      defaultInfo.tTitle = store.state.user.tTitle

      if (!page) page = defaultInfo.page
      if (!id) id = defaultInfo.id
      if (!sId) sId = defaultInfo.sId
      if (!tId) tId = defaultInfo.tId
      if (!tTitle) tTitle = defaultInfo.tTitle

      if (mode == 'chat') {
        // 分享到聊天
        let path = `${transpage}?href=${page}`
        if (sId) path = path + `&sId=${sId}`
        if (tId) path = path + `&tId=${tId}`
        if (tTitle) path = path + `&tTitle=${tTitle}`

        return {
          title: title || '',
          path: path || '',
          imageUrl: imageUrl || '',
        }
      } else if (mode == 'code') {
        // 生成二维码
        return { transpage, page, id, sId, tId, tTitle }
      }
    }
  },
}

/**
 * 全局混入的通用分享模块
 */
const common = {
  onShow() {
    // 设置默认的转发参数
    // share.setInfo()
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
     * 获取分享的小程序码
     */
    async getWxaCode() {
      // 将参数发送到服务器并生成短连接的无限小程序码
      const params = share.setInfo({}, 'code')
      return await apis.cloudapi.getUnlimited(params)
    },
  },
}

export default common
