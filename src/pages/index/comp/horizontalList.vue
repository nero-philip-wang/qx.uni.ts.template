<template>
  <div class="py-16">
    <div class="mx-32 pb-8 flex">
      <span>{{ params.title }}</span>
      <span class="text-sm flex-grow ml-16 pt-8 text-gray">{{ params.subtitle }}</span>
      <span class="text-sm pt-8 text-gray" @click="$goto(params.moreHref)">{{ params.moreTip }} ></span>
    </div>
    <u-scroll-list>
      <div v-for="(item, index) in params.list" :key="index" class="item my-8 text-center" @click="$goto(item.href)">
        <image
          class="icon rounded-sm"
          mode="aspectFill"
          :src="item.src"
          :style="{ height: autoAddUnit(params.height), width: autoAddUnit(params.height) }"
        ></image>
        <div v-show="item.title" class="title text-sm text-left truncate" :style="{ width: autoAddUnit(params.height) }">
          {{ item.title }}
        </div>
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
  methods: {
    autoAddUnit(height) {
      return isNaN(parseInt(height)) ? height : height + 'rpx'
    },
  },
}
</script>

<style scoped>
.item {
  padding-left: 20rpx;
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
