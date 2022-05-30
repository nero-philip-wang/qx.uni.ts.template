<template>
  <div class="py-16">
    <div class="mx-32 pb-8 flex">
      <span>{{ params.title }}</span>
      <span class="text-sm flex-grow ml-16 pt-8 text-gray">{{ params.subtitle }}</span>
      <span class="text-sm pt-8 text-gray">{{ params.moreTip }} ></span>
    </div>
    <u-scroll-list>
      <div v-for="(item, index) in params.list" :key="index" class="item my-8 text-center" @click="$goto(item.href)">
        <image class="icon rounded-sm" mode="aspectFill" :src="item.src"></image>
        <div class="title text-sm text-left truncate"> {{ item.title }} </div>
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
.title {
  width: 160rpx;
  margin: 0 auto;
}
</style>
