import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import config from '../config'
Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: (key) => uni.removeStorageSync(key),
      },
      key: config.appId,
      // paths: ['area', 'tabbar', 'share', 'user', 'searchHistory'],
    }),
  ],
  state: () => ({
    /** 省市县 */
    area: [],
    tabbar: [
      {
        iconPath: 'home',
        selectedIconPath: 'home-fill',
        text: '首页',
        pagePath: '/pages/index/index',
      },
      {
        iconPath: 'grid',
        selectedIconPath: 'grid-fill',
        text: '分类',
        pagePath: '/pages/cata/index',
      },
      {
        iconPath: 'shopping-cart',
        selectedIconPath: 'shopping-cart-fill',
        text: '购物车',
        pagePath: '/pages/cart/index',
      },
      {
        iconPath: 'account',
        selectedIconPath: 'account-fill',
        text: '我的',
        pagePath: '/pages/my/index',
      },
    ],
    share: {
      mid: null /** 分享人的会员 id */,
      source: '自主进入' /** 入口方式，如小程序码/分享卡片消息 */,
      eid: null /** 导购员/分销员 id */,
      sid: config.defaultShop.sid /** 销售店铺 id */,
      shop: config.defaultShop.shop /** 销售店铺名称 */,
      tid: config.defaultShop.tid /** 商户 id */,
      tenant: config.defaultShop.tenant /** 商户名称 */,
    },
    user: {
      member: {},
      token: null,
      openId: null,
      balance: [],
      shop: {},
    },
    searchHistory: [],
  }),
  getters: {
    isLogged: (state) => {
      return state.user.token && state.user.member.id
    },
    balance: (state) => state.user.balance,
    isDistributer: (state) => state.user.token && state.user.member.id && state.user.member.bindingMemberId == store.state.user.member.id,
    tabbars: (state) => state.tabbar,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.user.token = 'Bearer ' + token
    },
    SET_OPENID(state, openId) {
      state.user.openId = openId
    },
    SET_BALANCE(state, balance) {
      state.user.balance = balance
    },
    SET_MEMBER(state, member) {
      state.user.member = member
    },
    SET_SHOP(state, shop) {
      state.user.shop = shop
    },
    RESET_USER(state) {
      state.user = {
        member: {},
        token: null,
        balance: [],
      }
    },
    SET_SHARE_INFO(state, { mid, eid, sid, shop, tid, tenant, source }) {
      state.share.source = source ? decodeURIComponent(source) : state.share.source
      if (tid) {
        if (tid != state.share.tid) {
          this.commit('RESET_USER')
          state.share.mid = null
          state.share.sid = null
          state.share.eid = null
        }
        state.share.tid = tid
        state.share.tenant = decodeURIComponent(tenant)
      }
      if (sid) {
        if (sid != state.share.sid) {
          state.share.eid = null
        }
        state.share.sid = sid
        state.share.shop = decodeURIComponent(shop)
      }
      if (mid) state.share.mid = mid
      if (eid) state.share.eid = eid
    },
    SET_HISTORY(state, keyword) {
      var list = state.searchHistory
      const index = list.findIndex((item) => item === keyword)
      if (index > -1) {
        list.splice(index, 1)
      }
      list.unshift(keyword)
      // 只保存30条记录
      if (list.length > 30) {
        list.length = 30
      }
    },
    RESET_HISTORY(state) {
      state.searchHistory = []
    },
  },
})

export default store
