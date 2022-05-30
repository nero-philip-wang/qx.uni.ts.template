<template>
  <div>
    <div v-if="params.title" class="mx-16 my-8 flex">
      <span>{{ params.title }}</span>
      <span class="text-sm flex-grow ml-16 pt-8 text-gray">{{ params.subtitle }}</span>
      <span class="text-sm pt-8 text-gray">{{ params.moreTip }} ></span>
    </div>
    <div
      v-for="(item, index) in params.list"
      :key="index"
      class="mb-24 overflow-hidden bg-white rounded"
      :class="{ 'lineh-0': !item.title }"
       @click="$goto(item.href)"
    >
      <image class="image" mode="aspectFill" :src="item.src" :style="{ height: autoAddUnit(params.height) }"></image>
      <div v-if="item.title" class="flex my-8 mx-16">
        <div class="left">
          <div class="text-base truncate"> {{ item.title }} </div>
          <div class="text-sm text-gray truncate"> {{ item.subtitle }}</div>
        </div>
        <div class="text-price ml-16 text-right">
          <span> {{ item.price | yuan }}</span>
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
      return isNaN(parseInt(height)) ? height : height + 'rpx'
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
