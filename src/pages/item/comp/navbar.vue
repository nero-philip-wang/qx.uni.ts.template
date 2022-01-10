<template>
  <div>
    <u-navbar fixed auto-back placeholder>
      <u-tabs slot="center" :current="current" :list="list" line-color="#f5222d" @change="trigger"></u-tabs>
    </u-navbar>
  </div>
</template>

<script>
export default {
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
    anchorList: {
      type: Array,
      default: () => [0, 0, 0],
    },
  },
  data() {
    return {
      current: 0,
      list: [
        {
          name: '商品',
          id: 'main',
        },
        {
          name: '评价',
          id: 'rating',
        },
        {
          name: '详情',
          id: 'content',
        },
      ],
      scrolling: false,
    }
  },
  watch: {
    scrollTop(v) {
      const func = () => {
        this.current = v >= this.anchorList[2] ? 2 : v >= this.anchorList[1] ? 1 : 0
        this.scrolling = false
      }
      if (this.scrolling) uni.$u.debounce(func, 25)
      else func()
    },
  },
  methods: {
    trigger(item) {
      this.current = item.index
      uni.pageScrollTo({
        scrollTop: this.anchorList[item.index],
        duration: 300,
      })
      this.scrolling = true
    },
  },
}
</script>
