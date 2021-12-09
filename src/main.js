import Vue from 'vue'
import App from './App'
import store from './store' // store
import * as filters from './filters' // 全局过滤器
import uView from 'uview-ui' // uView
import mpShare from './utils/share/index'
import goto from './utils/goto' // goto

Vue.prototype.$goto = goto // goto
Vue.prototype.$store = store // store
Vue.prototype.$style = {
  textPriceColor: '#ca0007',
}

// 寄存器全局实用程序过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
Vue.use(uView) // uView
Vue.mixin(mpShare)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()
