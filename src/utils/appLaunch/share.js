import store from '@/store'
import qs from 'qs'
import app from '@/config/index'
const home = 'pages/index/home'
const defaultShare = { title: app.title, page: null, pageQuery: '', image: '' }

uni.$u.liteShare = { ...defaultShare }
function getShareInfo(addQueryToReslut = false) {
  var hiddenuid = !!uni.getStorageSync('hidden/share')

  var share = { ...store.state.share }
  delete share.source
  share.mid = (store.state.user.member && store.state.user.member.id) || ''
  if (hiddenuid) {
    share.mid = null
    share.eid = null
    share.sid = null
  }
  var { page } = uni.$u.liteShare
  if (!page) {
    page = getCurrentPages()
    page = page[page.length - 1]
  }
  if (addQueryToReslut) {
    share = { ...share, ...page.options }
  } else {
    share.path = encodeURIComponent(page.route + '?' + qs.stringify(page.options))
  }
  return share
}
/**
 * 全局混入的通用分享模块
 */
export default {
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    var { title, image } = uni.$u.liteShare
    var share = getShareInfo()
    console.log({
      title: title,
      path: `${home}?${qs.stringify(share)}`,
      imageUrl: image,
    })
    return {
      title: title,
      path: `${home}?${qs.stringify(share)}`,
      imageUrl: image,
    }
  },
  onShareTimeline() {
    var { title, image } = uni.$u.liteShare
    var share = getShareInfo(true)
    return {
      title: title,
      query: qs.stringify(share),
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
    wxaCodeUrl() {
      var share = getShareInfo()
      var sceneData = encodeURIComponent(qs.stringify(share))
      var url = `${process.env.VUE_APP_BASE_API}api/v1.0/mall/Share/wxacode?page=${home}&scene=${sceneData}&appid=${app.appId}`
      return url
    },
  },
}
