<template>
  <u-tabbar :value="value" :border="false" active-color="#ca0007" inactive-color="#cccccc" @change="change">
    <u-tabbar-item v-for="(c, idx) in tabbars" :key="c.text" :text="c.text" icon="home" :name="idx"></u-tabbar-item>
  </u-tabbar>
</template>
<script>
import { mapGetters } from 'vuex'
import goto from '@/utils/goto'

export default {
  name: 'Tabbar',
  props: {
    value: { type: Number, default: 0 },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['tabbars']),
  },
  mounted() {},
  methods: {
    change(idx) {
      goto(this.tabbars[idx].pagePath)
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
