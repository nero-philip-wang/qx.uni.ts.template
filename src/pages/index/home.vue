<template>
  <div class="h-page flex align-center text-center text-gray text-base">
    <div class="flex-grow "> 请稍后，页面跳转中…</div>
  </div>
</template>
<script>
import { getSence } from '@/apis/modules/home'
const defaultPage = '/pages/index/index'

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
  async onLoad(options) {
    // var info = share.getInfo()
    // this.href = info.path
    var sceneId = options.scene && options.scene.split('%')[0]
    try {
      this.loading = true
      var scene = await getSence(sceneId)
      this.$goto(scene)
    } catch (error) {
    } finally {
      this.loading = false
    }
  },
  onShow() {
    this.$nextTick(() => {
      if (this.href) this.$goto(this.href)
      else if (!this.loading) this.$goto(defaultPage)
      this.href = ''
    })
  },
  methods: {},
}
</script>
