<template>
  <scroll-view
    :style="{ height }"
    scroll-y
    scroll-with-animation
    :refresher-enabled="refresherEnabled"
    enable-back-to-top
    @scrolltolower="loadmore"
  >
    <slot :data="value"></slot>
    <u-loadmore v-if="loadmoreEnabled" :status="hasNext ? loading : nomore" />
  </scroll-view>
</template>
<script>
var loading = 'loading'
var nomore = 'nomore'
var paging = {
  take: 12,
  skip: 0,
}

export default {
  props: {
    refresherEnabled: {
      type: Boolean,
      default: false,
    },
    loadmoreEnabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: null,
    },
    request: {
      type: Function,
      default: null,
    },
    argvs: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading,
      nomore,
      hasNext: true,
      paging: { ...paging },
      oldargvs: {},
    }
  },
  watch: {
    loadmoreEnabled: {
      immediate: true,
      handler(v) {
        if (!v) this.hasNext = false
      },
    },
  },
  async created() {
    await this.loadmore()
  },
  methods: {
    async loadmore() {
      // 如果没有下一页，停止响应
      if (this.hasNext == false) return

      this.$emit('loadmore')
      if (this.request) {
        if (JSON.stringify(this.oldargvs) != JSON.stringify(this.argvs)) {
          // 参数改变，重置分页
          this.paging = { ...paging }
          this.value = []
        } else {
          // 参数不变，加载下一页
          this.paging.skip += this.paging.take
        }

        try {
          var list = await this.request({
            ...this.argvs,
            ...this.paging,
          })

          // 如果数据长度不足，那么停止loadmore
          if (list.length < this.paging.take) {
            this.hasNext = false
          }
          this.$emit('input', [...this.value, ...list])
          this.oldargvs = { ...this.argvs } // 记录上次参数
        } catch (error) {
          this.hasNext = false
          throw error
        }
      }
    },
  },
}
</script>
<style scoped></style>
