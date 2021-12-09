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
        text: '开单',
        pagePath: '/pages/order/index',
      },
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '会员',
        pagePath: '/pages/member/index',
      },
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '工作台',
        customIcon: false,
        pagePath: '/pages/index/index',
      },
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '分销',
        pagePath: '/pages/marketing/index',
      },
      {
        iconPath: 'star',
        selectedIconPath: 'star-fill',
        text: '佣金',
        pagePath: '/pages/salary/index',
      },
    ],
    user: {
      /** 已登录用户 */
      logged: {
        token: null,
        memberId: null,
        userId: null,
        title: null,
        avatar: null,
        openId: null,
      },
      /** 未登录信息 */
      logging: {},
      /** 商户id */
      tId: 1000,
      /** 商户名称 */
      tTitle: '',
      /** 分销人id */
      sId: null,
    },
  }),
  getters: {
    isLogged() {
      return this.state.user.logged.token && this.state.user.logged.memberId
    },
  },
  mutations: {
    SAVE_AREA(state, list) {
      state.area = list
    },
    SET_USERINFO(state, { token, userId, title, avatar, tenantId, shopId, employee }) {
      state.token = token
      state.userId = userId
      state.title = title
      state.avatar = avatar
      state.tenantId = tenantId
      state.shopId = shopId
      state.employee = employee
    },
    RESET_USERINFO(state) {
      state.token = null
      state.userId = null
      state.title = null
      state.avatar = null
      state.tenantId = 10001000
      state.shopId = 100010001000
      state.employee = {}
    },
    SET_SESSIONINFO(state, info) {
      state.sessionInfo = info
    },
  },
  // modules,
})

export default store
