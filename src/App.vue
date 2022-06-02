<script>
import utils from './utils'
import { tryLogin } from './apis/modules/login'
import { getMember } from './apis/modules/home'
import { mapMutations } from 'vuex'
import store from '@/store/index'
import { getPoster } from '@/apis/modules/home'
import { getCity } from '@/apis/modules/nolocation'

export default {
  data() {
    return {}
  },
  async onLaunch({ query }) {
    // 异步处理的方法
    setTimeout(async () => {
      // 检查更新
      utils.updateApp()
      // 获取海报配置
      await getPoster()
    }, 10)

    // 同步处理的方法
    uni.hideTabBar()
    // 设置分享来源
    console.log(query, '分享来源')
    if (query.sid) this.SET_SOURCE(query.sid)
    else this.SET_SOURCE(null)
    if (query.t) {
      this.SET_TENANT({ t: query.t, area: query.area })
    } else {
      this.checkTenant(query.t)
    }
    //  尝试登陆并更新用户信息
    try {
      var t = await tryLogin()
      if (t) {
        var m = await getMember()
        if (!query.sid && m.bindingMemberId && Date.parse(m.bindingExpire) > Date.now()) {
          this.SET_SOURCE(m.bindingMemberId)
        }
      }
    } catch (error) {}
  },
  methods: {
    ...mapMutations(['SET_SOURCE', 'SET_TENANT']),
    async checkTenant(t) {
      var city = ''
      try {
        city = await getCity()
      } catch (e) {}
      var noalert = `全国默认${city}`
      setTimeout(() => {
        if (!store.state.user.logged.token && !t && !noalert.includes(store.state.user.tTitle)) {
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
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import './style/index.scss';
</style>
