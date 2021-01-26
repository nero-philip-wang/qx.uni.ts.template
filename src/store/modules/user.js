export default {
  state: () => ({
    token: null,
    userId: null,
    title: null,
    avatar: null,
    tenantId: 10001000,
    shopId: 100010001000,
    sessionInfo: null,
    isEmployee: true,
    employee: {},
    sourceId: null,
  }),
  mutations: {
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
    SET_NOT_EMPLOYEE(state, status) {
      state.isEmployee = status
    },
    SET_SOURCE(state, sourceId) {
      state.sourceId = sourceId
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
  },
  actions: {},
  getters: {},
}
