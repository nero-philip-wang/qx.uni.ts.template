<template>
  <div class="app">
    <div class="bg-white">
      <u-tabs :list="tabs" :scrollable="false" @change="(item) => (argvs.status = item.index)"></u-tabs>
    </div>
    <listview v-model="list" height="calc(100vh - 88rpx)" loadmore-enabled :request="search" :argvs="argvs">
      <coupon v-for="(item, index) in list" :key="index" :item="item" :disabled="argvs.status != 0"> </coupon>
    </listview>
  </div>
</template>

<script>
import { search } from '@/apis/modules/coupon'
import listview from '@/components/listview'
import coupon from './comp/coupon-card.vue'

export default {
  components: { listview, coupon },
  data() {
    return {
      tabs: [{ name: '可用' }, { name: '已使用' }, { name: '已过期' }],
      argvs: { status: 0 },
      list: [], // 订单列表
    }
  },
  onLoad() {},
  methods: {
    search,
    trigger(item) {
      item.image = !item.image
    },
  },
}
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}
.left {
  width: 450rpx;
}
.text-price {
  font-size: 48rpx;
}
.hole {
  background-color: #f5f5f5;
  height: 20rpx;
  width: 20rpx;
  margin-left: -6rpx;
  margin-right: -6rpx;
}
.border {
  border-bottom: 1px dashed #e5e5e5;
  margin-bottom: 10rpx;
  margin-left: 6rpx;
}
.desc {
  width: 425rpx;
}
</style>
