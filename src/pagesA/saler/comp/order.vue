<template>
  <div class="mx-32 my-16 rounded-sm py-16 px-16 bg-white">
    <div class="flex text-base">
      <span class="flex-grow qxfont text-base">&#xe61e; {{ value.order.buyerNickName }}</span>
      <span class="text-primary">{{ value.order.status | orderstatus }}</span>
    </div>
    <div class="flex place-items-center bb-1 py-16 text-base text-center">
      <scroll-view
        v-if="value.order.items"
        scroll-x
        :style="{ width: value.order.items.length * 80 + 'rpx', maxWidth: 'calc(100% - 360rpx)' }"
      >
        <div :style="{ width: value.order.items.length * 80 + 'rpx' }">
          <image
            v-for="i in value.order.items"
            :key="i.id"
            :src="i.cover"
            class="mr-8 rounded-sm"
            style="width:72rpx;height:72rpx;"
          ></image>
        </div>
      </scroll-view>

      <div class="ml-4 flex-grow text-gray text-sm text-left">等{{ value.order.items.length || 0 }}件</div>
      <div class="ml-12">
        <div>订单总额</div>
        <div class="text-price">￥{{ value.order.orderAmount | yuan }}</div>
      </div>
      <div class="ml-12">
        <div>预计收入</div>
        <div class="text-price">￥{{ value.value | yuan }}</div>
      </div>
    </div>
    <div class="flex text-xs text-gray">
      <span class="flex-grow">{{ value.order.creationTime | timef }}创建</span>
      <span>订单号:{{ value.order.id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    orderstatus: (status) => {
      switch (status) {
        case 1:
          return '待支付'
        case 2:
          return '待派单'
        case 3:
          return '待上门'
        case 4:
          return '待评价'
        case 5:
          return '已完成'
        case -1:
          return '已取消'
      }
    },
  },
  props: {
    value: {
      required: true,
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style></style>
