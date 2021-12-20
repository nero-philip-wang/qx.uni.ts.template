<template>
  <div class="py-16">
    <div class="mx-32 flex">
      <span>本周畅销</span>
      <span class="text-sm">本周畅销</span>
      <span class="text-sm">查看更多</span>
    </div>
    <u-scroll-list>
      <div v-for="(item, index) in params.list" :key="index" class="item my-8 text-center">
        <image class="icon rounded-sm" mode="aspectFill" :src="item.src"></image>
        <div class="text-sm text-left"> 九妹三大数据库纳米颗粒，上课啦那款吗看了吗{{ index }} </div>
      </div>
    </u-scroll-list>
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
  methods: {},
}
</script>

<style scoped>
.item {
  min-width: 33%;
}
.icon {
  width: 160rpx;
  height: 160rpx;
}
</style>
