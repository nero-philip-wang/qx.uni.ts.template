<template>
  <view class="app">
    <div class="bg-white">
      <u-sticky>
        <u-tabs :list="navs" :current="navCurrent" @change="onNavBarChange"></u-tabs>
      </u-sticky>
    </div>
    <listview v-model="list" loadmore-enabled :request="search" :argvs="argvs" height="calc(100vh - 88rpx)">
      <div v-for="order in list" :key="order.id" class="bg-white rounded-sm mx-24 my-16 text-base">
        <div class="header flex bb-1 px-24 pt-20 pb-12">
          <span class="flex-grow text-sm text-gray"> {{ order.creationTime | timef }}</span>
          <span class="text-primary">{{ order.status | orderstatus }}</span>
        </div>
        <div class="item  px-24">
          <cartItem small />
        </div>
        <div class="text-right py-16 px-24 bb-1">
          <span>共{{ orderItemCount(order) }}件 总价 </span>
          <span class="text-price text-bold">￥{{ order.orderAmount | yuan }}</span>
        </div>
        <div class="opt flex px-24 py-16">
          <div class="flex-grow"></div>
          <div>
            <u-button :custom-style="{ padding: '0 30rpx' }" text="确认收货" size="small" shape="circle" type="primary"></u-button>
          </div>
        </div>
      </div>
    </listview>
  </view>
</template>

<script>
import { search } from '@/apis/modules/order.js'
import orderbiz from './mixin/order.js'
import listview from '@/components/listview'
import cartItem from '../cart/comp/cartItem.vue'

export default {
  components: { listview, cartItem },
  mixins: [orderbiz],
  data() {
    return {
      navs: [{ name: '全部' }, { name: '待付款' }, { name: '待派单' }, { name: '待服务' }, { name: '待评价' }],
      navCurrent: 0, // 当前tab
      list: [], // 订单列表
      argvs: { status: null },
    }
  },
  onLoad(options) {
    this.navCounts = options.status
    this.argvs.status = options.status == 0 ? null : options.status
  },
  methods: {
    search,
    orderItemCount(order) {
      var sum = 0
      order.items.forEach((element) => {
        sum += element.quantity
      })
      return sum
    },
    // tab切换
    onNavBarChange(current) {
      this.navCurrent = current.index
      this.argvs.status = current.index == 0 ? null : current.index
    },
  },
}
</script>
