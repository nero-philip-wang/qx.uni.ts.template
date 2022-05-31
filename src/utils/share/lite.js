/**
 * 分享主要有一下几种形式：
 * - 生成小程序码【code】
 * - 分享的聊天对话【chat】
 */
import store from '@/store'
const defaultShare = { title: null, page: '/pages/index/index', pageQuery: '', image: '' }
uni.$u.liteShare = { ...defaultShare }
/**
 * 全局混入的通用分享模块
 */
const common = {
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    var { title, page, pageQuery, image } = uni.$u.liteShare
    var userId = (store.state.user.logged && store.state.user.logged.id) || ''
    var tenantId = store.state.user.tId
    var area = store.state.user.tTitle

    return {
      title: title,
      path: `${page}?${pageQuery}${pageQuery ? '&' : ''}sid=${userId}&t=${tenantId}&area=${area}`,
      imageUrl: image,
    }
  },
  getParams() {
    var { page, pageQuery } = uni.$u.liteShare
    var userId = (store.state.user.logged && store.state.user.logged.id) || ''
    var tenantId = store.state.user.tId
    var area = store.state.user.tTitle
    return {
      page: `${page}?${pageQuery}${pageQuery ? '&' : ''}sid=${userId}&t=${tenantId}&area=${area}`,
    }
  },
  onShareTimeline() {
    var { title, page, pageQuery, image } = uni.$u.liteShare
    var userId = (store.state.user.logged && store.state.user.logged.id) || ''
    var tenantId = store.state.user.tId
    var area = store.state.user.tTitle
    return {
      title: title,
      query: `${pageQuery}${pageQuery ? '&' : ''}sid=${userId}&t=${tenantId}&area=${area}`,
      imageUrl: image,
    }
  },
  // #endif
  onUnload() {
    uni.$u.liteShare = { ...defaultShare }
  },
  methods: {
    /**
     * 获取分享的小程序码
     */
    async getWxaCode() {},
  },
}

export default common
