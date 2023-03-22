import store from '@/store/index'
import utils from '../'
import SceneEnum from './scene'
import { loginByCode } from '@/apis/modules/user'
import api from '@/apis'
import { getPoster, getSence } from '@/apis/modules/home'
import qs from 'qs'

const SET_SHARE_INFO = (v) => store.commit('SET_SHARE_INFO', v)
const defaultPage = 'pages/index/index'
const homePage = 'pages/index/home'

export default {
  that: null,
  hasSetShareInfo: false,
  navigate2Index: false,
  init(instance) {
    this.that = instance
  },
  /** App的onLaunch */
  async onLaunch({ scene, query, path }) {
    if (!path) path = uni.getLaunchOptionsSync().path
    console.log(SceneEnum[scene], { query, path })
    SET_SHARE_INFO({ source: SceneEnum[scene] })
    // 通过分享来源设置当前店铺
    if (query) await this.getShareFromQuery(query)
    // 如果是访问你的home页面，那么下载后退进入home页面时返回index
    if (path == homePage) this.navigate2Index = true
    // 尝试登录
    await this.tryLogin()
    // 获取店铺信息
    await this.getShop()
    /** 不着急的任务 */
    setTimeout(async () => {
      // 升级
      utils.updateApp()
      // 获取海报配置
      await getPoster()
    }, 1500)
  },
  /** home页面的show */
  onHomeShow() {
    this.that.$nextTick(() => {
      if (this.navigate2Index) this.that.$goto(defaultPage)
    })
  },
  /** 从query中读取分享谢谢 */
  async getShareFromQuery(query) {
    var destPath = null
    // 直接小程序卡片分享
    if (query.tid && query.eid) {
      var { mid, eid, sid, shop, tid, tenant } = query
      SET_SHARE_INFO({ mid, eid, sid, shop, tid, tenant })
      this.hasSetShareInfo = true
      if (query.path) destPath = decodeURIComponent(decodeURIComponent(query.path))
    }
    // 通过二维码场景id分享
    else if (query.scene) {
      var sceneId = query.scene && query.scene.split('%')[0]
      this.navigate2Index = false
      var page = await getSence(sceneId)
      var scene = qs.parse(page)
      SET_SHARE_INFO(scene)
      this.hasSetShareInfo = true
      destPath = decodeURIComponent(scene.path)
    }
    // 如果query中携带了跳转页面，那么跳转到目标页面
    if (destPath) this.that.$goto(destPath)
  },
  /** 获取店铺信息  */
  async getShop() {
    var shop = await api.shop.get(store.state.share.sid)
    SET_SHARE_INFO({
      sid: shop.id,
      shop: shop.subTitle,
      tid: shop.tenantId,
      tenant: shop.tenant.subTitle,
    })
  },
  /** 尝试登录 */
  async tryLogin() {
    var token = store.state.user.token
    if (token) {
      try {
        var member = await api.home.getMember()
        if (!this.hasSetShareInfo) {
          SET_SHARE_INFO({ eid: member.bindingAssistantId, sid: member.bindingShopId })
        }
      } catch (error) {
        console.log(error)
        /** 有token但是过期了,通过code登录 */
        await this.uniLogin()
      }
    } else {
      await this.uniLogin()
    }
  },
  /** 通过uni.login登录 */
  async uniLogin() {
    var result = await loginByCode()
    if (result.token && !this.hasSetShareInfo) {
      SET_SHARE_INFO({ eid: result.member.bindingAssistantId, sid: result.member.bindingShopId })
    } else {
      return result
    }
  },
}
