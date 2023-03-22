<script>
import appLaunch from '@/utils/appLaunch'

export default {
  data() {
    return {}
  },
  async onLaunch({ query, scene }) {
    appLaunch.init(this)
    appLaunch.onLaunch({ query, scene })
  },
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import './style/index.scss';
</style>
