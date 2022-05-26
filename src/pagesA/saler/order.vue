<template>
  <div class="h-page">
    <div class="bg-white">
      <u-tabs :list="navs" :scrollable="false"></u-tabs>
    </div>
    <Order />
  </div>
</template>

<script>
import Order from './comp/order.vue'

export default {
  components: { Order },
  data() {
    return {
      navs: [{ name: '待结算' }, { name: '已结算' }, { name: '已取消' }],
    }
  },
}
</script>

<style></style>
