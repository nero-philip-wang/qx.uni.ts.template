<script>
import utils from './utils'
import { tryLogin } from './apis/modules/login'
// import share from '@/utils/share/index'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },
  async onLaunch() {
    uni.hideTabBar()
    utils.updateApp()
    try {
      await tryLogin()
    } catch (error) {}
    // var info = wx.getLaunchOptionsSync()
    // if (info.path.indexOf('pages/index/home') == -1) share.getInfo()
  },
  methods: {
    ...mapMutations(['SET_SOURCE', 'SET_TENANT']),
  },
  onShow({ query }) {
    // 设置分享来源
    console.log(query, '分享来源')
    if (query.sid) this.SET_SOURCE(query.sid)
    else this.SET_SOURCE(null)
    if (query.t) {
      this.SET_TENANT({ t: query.t, area: query.area })
    }
  },
  onHide: function() {},
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import './style/index.scss';
</style>
