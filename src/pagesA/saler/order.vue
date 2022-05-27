<template>
  <div class="h-page">
    <div class="bg-white">
      <u-tabs :list="navs" :scrollable="false" @change="(v) => (argvs.status = v.code)"></u-tabs>
    </div>
    <listview v-model="list" height="calc(100vh - 88rpx)" loadmore-enabled :argvs="argvs" :request="remix">
      <Order v-for="c in list" :key="c" :value="c" />
    </listview>
  </div>
</template>

<script>
import Order from './comp/order.vue'
import { order } from '@/apis/modules/distribution'
import listview from '@/components/listview'

const Cancelled = -1
const Initiated = 0
const Arrived = 2

export default {
  components: { Order, listview },
  data() {
    return {
      navs: [
        { name: '待结算', code: Initiated },
        { name: '已结算', code: Arrived },
        { name: '已取消', code: Cancelled },
      ],
      argvs: {
        status: Initiated,
      },
      list: [],
    }
  },
  methods: {
    async remix(p) {
      var res = await order(p)
      var list = res.rebateList
        .filter((c) => c.orderId)
        .map((c) => ({
          ...c,
          order: res.orders.find((x) => x.id == c.orderId),
        }))
      return list
    },
  },
}
</script>

<style></style>
