import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

// // https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/)

// // 你不需要 `import app from './modules/app'`,它将自动要求所有vuex模块从模块文件
// // it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: (key) => uni.removeStorageSync(key),
      },
      key: 'uni',
    }),
  ],
  state: () => ({
    /** 省市县 */
    area: [],
    tabbar: [
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '首页',
        pagePath: '/pages/index/index',
      },
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '分类',
        pagePath: '/pages/cata/index',
      },
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '购物车',
        pagePath: '/pages/cart/index',
      },
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '我的',
        pagePath: '/pages/my/index',
      },
    ],
    user: {
      /** 已登录用户 */
      logged: {
        token: null,
        openId: null,
        id: null,
        userId: null,
        nickname: null,
        avatar: null,
      },
      /** 未登录信息 */
      logging: {},
      /** 商户id */
      tId: 1000,
      /** 商户名称 */
      tTitle: '海口',
      /** 分销人id */
      sId: null,
    },
  }),
  getters: {
    isLogged: (state) => {
      return state.user.logged.token && state.user.logged.id
    },
    token: (state) => {
      return state.user.logged.token
    },
    tabbars: (state) => state.tabbar,
  },
  mutations: {
    SAVE_AREA(state, list) {
      state.area = list
    },
    SET_USERINFO(state, { token, openId, id, userId, nickname, avatar }) {
      state.user.logged = {
        token,
        openId,
        id,
        userId,
        nickname,
        avatar,
      }
    },
    RESET_USERINFO(state) {
      state.user.logged = {
        token: null,
        id: null,
        userId: null,
        title: null,
        avatar: null,
        openId: null,
      }
    },
    SET_TOKEN(state, token) {
      state.user.logged.token = token
    },
    SET_TENANT(state, { t, area }) {
      if (state.user.tId != t) {
        state.user.tId = t
        state.user.tTitle = area
        store.commit('RESET_USERINFO')
      }
    },
    SET_SESSIONINFO(state, info) {
      state.sessionInfo = info
    },
  },
  // modules,
})

export default store
