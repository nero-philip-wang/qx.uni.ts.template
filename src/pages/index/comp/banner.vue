<template>
  <div>
    <div v-if="params.title" class="mr-16 ml-4 my-20 flex">
      <span class="text-xl text-bold" style="letter-spacing: 3rpx">{{ params.title }}</span>
      <span class="text-sm flex-grow ml-16 pt-8 text-gray">{{ params.subtitle }}</span>
      <span class="text-sm pt-8 text-gray" @click="$goto(params.moreHref)">{{ params.moreTip }} ></span>
    </div>
    <u-swiper
      :autoplay="!params.title"
      indicator
      indicator-mode="dot"
      :circular="!!params.title"
      img-mode="aspectFill"
      :list="params.list.map((c) => c.src)"
      :height="autoAddUnit(params.height)"
      :next-margin="params.title ? '50rpx' : undefined"
      radius="16rpx"
      @click="goto"
    ></u-swiper>
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
      var rate = this.params.title ? 650 / 750 : 700 / 750
      return isNaN(parseInt(height)) ? height : rate * height + 'rpx'
    },
    goto(idx) {
      this.$goto(this.params.list[idx].href)
    },
  },
}
</script>
