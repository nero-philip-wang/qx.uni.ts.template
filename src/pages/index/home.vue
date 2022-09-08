<template>
  <div class="h-page flex align-center text-center text-gray text-base">
    <div class="flex-grow "> 请稍后，页面跳转中…</div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { getSence } from '@/apis/modules/home'
const defaultPage = '/pages/index/index'

var qs = (qs) => {
  var set = {}
  if (qs) {
    var pairs = qs.split(/[?&]/)
    pairs.forEach((element) => {
      var pair = element.split('=')
      if (pair.length > 1) {
        set[pair[0]] = pair[1]
      }
    })
  }
  return set
}

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
      // 设置分享
      this.setQuery(scene)
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
  methods: {
    ...mapMutations(['SET_SOURCE', 'SET_TENANT']),
    setQuery(url) {
      var query = qs(url)
      console.log(query, '图片分享')
      if (query.sid) this.SET_SOURCE(query.sid)
      else this.SET_SOURCE(null)
      if (query.t) {
        this.SET_TENANT({ t: query.t, area: query.area })
      } else {
        this.checkTenant(query.t)
      }
    },
  },
}
</script>
