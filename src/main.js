import Vue from 'vue'
import App from './App'
import store from './store' // store
import * as filters from './filters' // 全局过滤器
import uView from 'uview-ui' // uView
import share from '@/utils/share/lite'
import goto from './utils/goto' // goto

Vue.prototype.$goto = goto // goto
Vue.prototype.$store = store // store

const primaryColor = '#34bc98'
uni.$u.props.checkbox.activeColor = primaryColor
uni.$u.props.tabbar.activeColor = primaryColor
uni.$u.props.tabs.lineColor = primaryColor
uni.$u.props.scrollList.indicatorActiveColor = primaryColor
uni.$u.props.tabs.lineWidth = '50rpx'

// 寄存器全局实用程序过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
Vue.use(uView) // uView
Vue.mixin(share)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()
