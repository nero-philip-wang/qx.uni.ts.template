const getters = {
  tabbars: (state) => state.tabbar.list, // 自定义tabbar
  onlineconfig: (state) => state.onlineconfig, // 在线下载配置
  areas: (state) => state.onlineconfig.area, // 地址
  docs: (state) => state.docs, // 文档类信息
  _: (state) => state.docs._, // 可配置字符串加载
}
export default getters
