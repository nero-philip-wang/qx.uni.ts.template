<template>
  <view>
    页面跳转中……
  </view>
</template>
<script>
import share from '@/utils/share/index'
const defaultPage = '/pages/index/index'
export default {
  data() {
    return {
      href: '',
    }
  },
  /**
   * 所有跳转场景的落地页
   */
  onLoad(options) {
    // debugger
    var info = share.getInfo()
    this.href = info.path
  },
  onShow() {
    this.$nextTick(() => {
      if (this.href) this.$goto(this.href)
      else this.$goto(defaultPage)
      this.href = ''
    })
  },
  methods: {},
}
</script>
