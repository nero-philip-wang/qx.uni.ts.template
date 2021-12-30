<template>
  <div class="page">
    <div class="bg-white p-32">
      <div class="open flex flex-wrap"><u-icon name="map" size="32rpx"></u-icon> 已开通服务的城市</div>
      <div class="flex flex-wrap">
        <span v-for="c in tenants" :key="c.id" class="m-16">
          <u-tag :text="c.area" plain type="info" color="#272727" @click="change(c)" />
        </span>
      </div>
    </div>

    <div class="bg-white mt-16 p-32">
      <div class="open"> 即将开通服务的城市</div>
      <div class="flex flex-wrap">
        <span v-for="c in noarea" :key="c.id" class="mr-24 m-12">
          <u-tag :text="c" plain type="info" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { tenant } from '@/apis/modules/home'
import store from '@/store'

export default {
  data() {
    return {
      tenants: [],
      noarea: ['三亚', '南京', '武汉', '北京', '苏州', '广州'],
    }
  },
  async created() {
    await this.getTenant()
  },
  methods: {
    async getTenant() {
      var list = await tenant()
      this.tenants = list
    },
    change(tenant) {
      store.commit('SET_TENANT', { t: tenant.id, area: tenant.area })
      this.$goto('/pages/index/index', { way: 'reLaunch' })
    },
  },
}
</script>

<style lang="scss" scoped>
.open {
  font-size: 28rpx;
  line-height: 40rpx;
  color: #464646;
  height: 40rpx;
  margin-bottom: 12px;
}
</style>
