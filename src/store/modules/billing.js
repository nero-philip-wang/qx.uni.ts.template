export default {
  state: () => ({
    orderCreateDto: {
      consignee: {},
      items: [],
    },
    order: {},
  }),
  mutations: {
    SET_CONSIGNEE(state, consignee) {
      state.orderCreateDto.consignee = consignee
    },
    SET_ITEMS(state, items) {
      state.orderCreateDto.items = items
    },
  },
  actions: {},
  getters: {},
}
