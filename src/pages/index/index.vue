<template>
  <div>
    <u-navbar safe-area-inset-top placeholder fixed bg-color="#F2F3F7">
      <div slot="left" class="px-16 py-16">
        <u-search placeholder="请输入关键字" :show-action="false" disabled></u-search>
      </div>
    </u-navbar>

    <div class="m-24 bg-white rounded">
      <banner :params="p" />
    </div>

    <div class="m-24 bg-white rounded">
      <diamond :params="p2" />
    </div>

    <div class="m-24 bg-white rounded">
      <horizontalList :params="p2" />
    </div>

    <qx-tabbar />
  </div>
</template>
<script>
import banner from './comp/banner.vue'
import diamond from './comp/diamond.vue'
import horizontalList from './comp/horizontalList.vue'
import { section } from './comp/meta'

var p2 = section()
p2.list.push(...p2.list)
export default {
  components: {
    banner,
    diamond,
    horizontalList,
  },
  data() {
    return {
      p: { ...section(), height: '320rpx' },
      p2,
    }
  },
  async mounted() {},
  beforeCreate() {
    uni.hideTabBar()
  },
  methods: {},
}
</script>
