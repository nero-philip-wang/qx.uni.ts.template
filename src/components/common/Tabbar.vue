<template>
  <u-tabbar
    v-model="current"
    :list="tabbars"
    :border-top="true"
    height="54px"
    icon-size="48"
    active-color="#00b2b6"
    inactive-color="#cccccc"
    @change="change"
  ></u-tabbar>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabbar',
  props: {
    vaule: { type: Number, default: 0 },
  },
  data() {
    return {
      current: 0,
    }
  },
  computed: {
    ...mapGetters(['tabbars']),
  },
  mounted() {
    this.current = this.vaule
  },
  methods: {
    change(idx) {
      uni.navigateTo({
        url: this.tabbars[idx].pagePath,
      })
    },
  },
}
</script>

<style scoped>
.u-tabbar__content__item__text {
  bottom: 6rpx !important;
  font-size: 24rpx !important;
}
.border {
  border-top: 1px solid #cccccc;
}
</style>
