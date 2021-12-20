<template>
  <div class="py-16 flex flex-wrap">
    <div v-for="(item, index) in params.list" :key="index" class="my-8 text-center" :style="{ minWidth }">
      <image class="icon rounded-sm" mode="aspectFill" :src="item.src"></image>
      <div class="text-sm"> 九妹{{ index }} </div>
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
  computed: {
    minWidth() {
      var count = this.params.list.length
      if (count == 5 || count == 10) return '20%'
      else return '25%'
    },
  },
  methods: {},
}
</script>

<style scoped>
.item {
  min-width: 25%;
}
.icon {
  width: 90rpx;
  height: 90rpx;
}
</style>
