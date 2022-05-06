/* eslint-disable no-dupe-keys */
const store = Object.assign(
  {},
  {
    // #ifdef MP-WEIXIN
    appid: wx.getAccountInfoSync().miniProgram.appId,
    appkey: 'sdasd156s1d56s15d1sa651',
    version: wx.getAccountInfoSync().miniProgram.version,
    // #endif

    // #ifndef MP-WEIXIN
    appid: 'app',
    appkey: 'sdasd156s1d56s15d1sa651',
    version: '1.0.0',
    // #endif

    _: {
      a: '请下载最新版',
    },
    address: null,
    items: [],
    cartCount: 0,
    needRefreshMember: false,
  }
)
export default store
