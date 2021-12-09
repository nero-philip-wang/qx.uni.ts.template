<template>
  <Cart show-tabbar />
</template>
<script>
import Cart from './cart.vue'

export default {
  components: { Cart },
  data() {
    return {}
  },
  beforeCreate() {
    uni.hideTabBar()
  },
}
</script>
