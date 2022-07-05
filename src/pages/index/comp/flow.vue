<template>
  <div>
    <div v-if="params.title" class="mr-16 ml-4 my-20 flex">
      <span class="text-xl text-bold" style="letter-spacing: 3rpx">{{ params.title }}</span>
      <span class="text-sm flex-grow ml-16 pt-8 text-gray">{{ params.subtitle }}</span>
      <span class="text-sm pt-8 text-gray" @click="$goto(params.moreHref)">{{ params.moreTip }} ></span>
    </div>
    <div
      v-for="(item, index) in params.list"
      :key="index"
      class="mb-28 overflow-hidden bg-white rounded"
      :class="{ 'lineh-0': !item.title }"
      @click="$goto(item.href)"
    >
      <image class="image" mode="aspectFill" :src="item.src" :style="{ height: autoAddUnit(params.height) }"></image>
      <div v-if="item.title" class="flex place-items-center mt-8 mb-24 mx-16">
        <div class="left">
          <div class="text-lg text-bold truncate"> {{ item.title }} </div>
          <div class="mt-8 text-base text-gray truncate"> {{ item.subtitle }}</div>
        </div>
        <div class="text-bold text-price ml-16 text-right">
          <span style="font-size:40rpx"> {{ item.price }}</span>
          <span class="text-sm">元</span>
        </div>
      </div>
    </div>
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
  computed: {},
  methods: {
    autoAddUnit(height) {
      var rate = 700 / 750
      return isNaN(parseInt(height)) ? height : rate * height + 'rpx'
    },
  },
}
</script>

<style scoped>
.image {
  width: 100%;
}
.left {
  width: 520rpx;
}
.text-price {
  width: 200rpx;
}
</style>
