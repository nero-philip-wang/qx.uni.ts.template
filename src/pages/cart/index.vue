<template>
  <Cart show-tabbar :refresh="now" />
</template>
<script>
import Cart from './cart.vue'

export default {
  components: { Cart },
  data() {
    return {
      now: 0,
      first: true,
    }
  },
  beforeCreate() {
    uni.hideTabBar()
  },
  onShow() {
    if (this.first) {
      this.first = false
      return
    }
    this.now = Date.now()
  },
}
</script>
