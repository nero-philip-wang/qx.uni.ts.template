const store = Object.assign(
  {},
  {
    appid: wx.getAccountInfoSync().miniProgram.appId,
    appkey: 'sdasd156s1d56s15d1sa651',
    version: wx.getAccountInfoSync().miniProgram.version,
    _: {
      a: '请下载最新版',
    },
    address: null,
    items: null,
  }
)
export default store
