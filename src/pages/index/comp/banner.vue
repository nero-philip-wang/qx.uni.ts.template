<template>
  <div>
    <u-swiper img-mode="aspectFill" :list="params.list.map((c) => c.src)" :height="autoAddUnit(params.height)" @click="goto"></u-swiper>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    autoAddUnit(height) {
      return isNaN(parseInt(height)) ? height : height + 'rpx'
    },
    goto(idx) {
      this.$goto(this.params.list[idx].href)
    },
  },
}
</script>
