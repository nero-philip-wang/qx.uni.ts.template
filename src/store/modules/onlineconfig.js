export default {
  state: () => ({
    area: [],
  }),
  mutations: {
    SAVE_AREA(state, list) {
      state.area = list
    },
  },
  actions: {
    async getarea ({ state, commit }) {
      if (state.area.length > 0) {
        return state.area
      } else {
        // var [err, res] = await 
        uni.request({
          url: 'https://chain.bebefocusmall.com/wwwroot/areas.json',
          success: (res)=>{
            commit('SAVE_AREA', res.data)
          }
        })
        return state.area
      }
    },
  },
  getters: {},
}
