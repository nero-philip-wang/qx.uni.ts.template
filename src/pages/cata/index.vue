<template>
  <div class="h-page flex-col">
    <div class="px-16 py-16">
      <u-search placeholder="请输入关键字" :show-action="false" bg-color="#fff" disabled></u-search>
    </div>
    <div class="flex-grow flex overflow-hidden">
      <scroll-view scroll-y scroll-with-animation style="width:180rpx">
        <div v-for="i in 15" :key="i" class="text-base lv1_item" :class="{ active: i == selectedLv1 }" @click="selectedLv1 = i">
          {{ i }}
        </div>
      </scroll-view>
      <scroll-view scroll-y scroll-with-animation class="h-full bg-white" style="width:570rpx">
        <item v-for="i in 8" :key="i" small is-item class="">{{ i }}</item>
      </scroll-view>
    </div>
    <qx-tabbar value="1" />
  </div>
</template>
<script>
import item from '../cart/comp/cartItem.vue'

export default {
  components: { item },
  data() {
    return {
      selectedLv1: 0,
      cata: [],
    }
  },
}
</script>
<style scoped>
.h-page {
  /* background: #f8f8f7; */
}
.lv1_item {
  height: 100rpx;
  line-height: 28rpx;
  color: #1b1b1b;
  text-align: center;
  padding: 36rpx 0;
  border-left: #f5f5f5 solid 8rpx;
  background: #f8f8f7;
  color: #969799;
}
.lv1_item.active {
  border-left: #b50006 solid 8rpx;
  background: #ffffff;
  color: #1b1b1b;
}
</style>
