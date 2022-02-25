<template>
  <view class="app">
    <div class="bg-white">
      <u-sticky>
        <u-tabs :list="navs" :current="navCurrent" :scrollable="false" @change="onNavBarChange"></u-tabs>
      </u-sticky>
    </div>
    <listview v-model="list" loadmore-enabled :request="search" :argvs="argvs" height="calc(100vh - 88rpx)" manual>
      <div
        v-for="order in list"
        :key="order.id"
        class="bg-white rounded-sm mx-24 my-16 text-base"
        @click="$goto('pages/order/detail?id=' + order.id)"
      >
        <div class="header flex bb-1 px-24 pt-20 pb-12">
          <span class="flex-grow text-sm text-gray"> {{ order.creationTime | timef }}</span>
          <span class="text-primary">{{ order.status | orderstatus }}</span>
        </div>
        <div class="item  px-24">
          <cartItem v-for="item in order.items || []" :key="item.id" small disabled-link :value="item" />
        </div>
        <div class="text-right py-16 px-24 bb-1">
          <span>共{{ orderItemCount(order) }}件 总价 </span>
          <span class="text-price text-bold">￥{{ order.orderAmount | yuan }}</span>
        </div>
        <div v-if="order.status > 0" class="opt px-24 py-16" @click.stop.prevent>
          <orderBar :order="order" />
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
import orderBar from './mixin/order-bar.vue'

export default {
  components: { listview, cartItem, orderBar },
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
    this.navCurrent = options.status
    this.argvs.status = options.status == 0 ? null : options.status
  },
  methods: {
    search,
    orderItemCount(order) {
      var sum = 0
      order.items.forEach((element) => {
        sum += element.quantity
        element.price = element.totalAmount
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
