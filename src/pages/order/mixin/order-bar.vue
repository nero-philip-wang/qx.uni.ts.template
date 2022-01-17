<template>
  <div class="flex">
    <div class="flex-grow">
      <slot></slot>
    </div>
    <div v-for="b in buttons" :key="b.title" class="ml-32">
      <u-button :type="b.type" shape="circle" size="small" :text="b.title" :custom-style="style" @click="onclick(b)"></u-button>
    </div>
  </div>
</template>

<script>
import biz from './order'

const orderStatus = {
  '1': '待支付',
  '2': '待派单',
  '3': '待上门',
  '4': '待评价',
  '5': '已完成',
  '-1': '已取消',
  待支付: 1,
  待派单: 2,
  待上门: 3,
  待评价: 4,
  已完成: 5,
  已取消: -1,
}
const btns = [
  {
    title: '取消订单',
    type: 'info',
    status: orderStatus.待支付,
    isNegative: true,
    click: biz.methods.cancel,
  },
  { title: '立即支付', type: 'primary', status: orderStatus.待支付, click: biz.methods.gopay },
  { title: '确认服务', type: 'primary', status: orderStatus.待派单, click: biz.methods.confirmReceipt },
  { title: '确认服务', type: 'primary', status: orderStatus.待上门, click: biz.methods.confirmReceipt },
  { title: '立即评价', type: 'primary', status: orderStatus.待评价, click: biz.methods.gotoComment },
]

export default {
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    showNegative: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      style: {
        padding: '0 32rpx',
        // borderRadius: '0',
      },
    }
  },
  computed: {
    buttons() {
      return btns.filter((c) => c.status == this.order.status && (this.showNegative || !c.isNegative))
    },
  },
  methods: {
    onclick(opt) {
      opt.click(this.order)
    },
  },
}
</script>

<style lang="scss" scoped></style>
