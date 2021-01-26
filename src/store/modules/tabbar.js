const tabbar = {
  state: () => ({
    list: [
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
  }),
  mutations: {},
  actions: {},
  getters: {},
}

export default tabbar
