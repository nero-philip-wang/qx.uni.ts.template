<template>
  <div class="h-page flex align-center text-center text-gray text-base">
    <div class="flex-grow "> 请稍后，页面跳转中…</div>
  </div>
</template>
<script>
import appLaunch from '@/utils/appLaunch'

export default {
  data() {
    return {
      href: '',
      loading: false,
    }
  },
  /**
   * 所有跳转场景的落地页
   */
  async onLoad(options) {},
  onShow() {
    appLaunch.onHomeShow()
  },
}
</script>
