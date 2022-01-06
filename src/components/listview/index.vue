<template>
  <scroll-view
    :style="{ height }"
    scroll-y
    scroll-with-animation
    :refresher-enabled="refresherEnabled"
    enable-back-to-top
    @scrolltolower="loadmore"
  >
    <slot v-if="value && value.length" :data="value"></slot>
    <div v-else-if="!hasNext" class="my-32">
      <u-empty mode="data" text="没有更多数据"></u-empty>
    </div>
    <div v-if="(value && value.length) || hasNext" class="my-24">
      <u-loadmore v-if="loadmoreEnabled" :status="hasNext ? loading : nomore" />
    </div>
  </scroll-view>
</template>
<script>
var loading = 'loading'
var nomore = 'nomore'
var paging = {
  take: 10,
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
    manual: {
      type: Boolean,
      default: false,
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
    argvs: {
      deep: true,
      async handler(v) {
        this.hasNext = true
        await this.loadmore()
      },
    },
  },
  async mounted() {
    if (!this.manual) await this.loadmore()
  },
  methods: {
    async loadmore() {
      // 如果没有下一页，停止响应
      if (this.hasNext == false) return

      this.$emit('loadmore')
      if (this.request) {
        // debugger
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
