<script>
import utils from './utils'
import { tryLogin } from './apis/modules/login'
// import share from '@/utils/share/index'
import { mapMutations } from 'vuex'
import store from '@/store/index'
import { getPoster } from '@/apis/modules/home'

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
    await getPoster()
    // var info = wx.getLaunchOptionsSync()
    // if (info.path.indexOf('pages/index/home') == -1) share.getInfo()
  },
  methods: {
    ...mapMutations(['SET_SOURCE', 'SET_TENANT']),
    async checkTenant(t) {
      setTimeout(() => {
        if (!store.state.user.logged.token && !t) {
          // 未登录
          uni.showModal({
            title: '提示',
            content: '您当前浏览的站点是' + store.state.user.tTitle + '，如不在当前区域，点击确定更换',
            success: (res) => {
              if (res.confirm) {
                this.$goto('/pages/index/tenant')
              } else if (res.cancel) {
              }
            },
          })
        }
      }, 1200)
    },
  },
  onShow({ query }) {
    // 设置分享来源
    console.log(query, '分享来源')
    if (query.sid) this.SET_SOURCE(query.sid)
    else this.SET_SOURCE(null)
    if (query.t) {
      this.SET_TENANT({ t: query.t, area: query.area })
    } else {
      this.checkTenant(query.t)
    }
  },
  onHide: function() {},
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import './style/index.scss';
</style>
