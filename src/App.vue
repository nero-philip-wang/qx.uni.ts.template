<script>
import utils from './utils'
import { tryLogin } from './apis/modules/login'
// import share from '@/utils/share/index'

export default {
  data() {
    return {}
  },
  computed: {},
  async onLaunch() {
    uni.hideTabBar()
    utils.updateApp()
    try {
      await tryLogin()
    } catch (error) {}
    // var info = wx.getLaunchOptionsSync()
    // if (info.path.indexOf('pages/index/home') == -1) share.getInfo()
  },
  methods: {},
  onShow: function() {},
  onHide: function() {},
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import './style/index.scss';
</style>
