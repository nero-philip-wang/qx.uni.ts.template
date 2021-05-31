<script>
import utils from './utils'
// import { tryLogin } from './apis/modules/login'
import share from '@/utils/share/index'
import Vue from 'vue'

export default {
  data() {
    return {}
  },
  computed: {},
  async onLaunch() {
    utils.updateApp()
    // await tryLogin()

    var info = wx.getLaunchOptionsSync()
    if (info.path.indexOf('pages/index/home') == -1) share.getInfo()
  },
  methods: {
    /**
     * 存储设备信息 参考colorUI
     * @param {Object}
     */
    initSize(e) {
      const systemInfo = e
      let navigationBarHeight
      let custom = {}
      // #ifndef MP
      custom = { height: 36, width: 88 }
      navigationBarHeight = 44
      // #endif
      // #ifdef MP
      custom = wx.getMenuButtonBoundingClientRect()
      navigationBarHeight = custom.bottom + custom.top - e.statusBarHeight * 2
      // #endif
      systemInfo.custom = custom
      systemInfo.navigationBarHeight = navigationBarHeight
      Vue.prototype.systemInfo = systemInfo
    },
  },
  onShow: function() {
    uni.getSystemInfo({
      success: (e) => {
        this.initSize(e)
      },
    })
  },
  onHide: function() {},
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import 'style/common.css';
@import './static/common.css';
</style>
