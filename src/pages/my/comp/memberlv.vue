<template>
  <u-popup :show="show" mode="bottom" round="15rpx" @close="$emit('update:show', false)">
    <div class="z-100 px-32 py-48">
      <div class="flex align-center mb-32">
        <u-avatar src="https://s.re4.top/upload/unimall/img/ABDCN3CK7BQ=.png"></u-avatar>
        <div class="ml-12">
          <div class=" text-base">白金会员</div>
          <div class="text-sm text-gray"> 所有商品享受8.5折优惠，五星保洁师服务</div>
        </div>
      </div>
      <div class="flex align-center mb-32">
        <u-avatar src="https://s.re4.top/upload/unimall/img/ABDCN3CK7BQ=.png"></u-avatar>
        <div class="ml-12">
          <div class=" text-base">白金会员</div>
          <div class="text-sm text-gray"> 所有商品享受8.5折优惠，五星保洁师服务</div>
        </div>
      </div>
      <div class="flex align-center mb-32">
        <u-avatar src="https://s.re4.top/upload/unimall/img/ABDCN3CK7BQ=.png"></u-avatar>
        <div class="ml-12">
          <div class=" text-base">白金会员</div>
          <div class="text-sm text-gray"> 所有商品享受8.5折优惠，五星保洁师服务</div>
        </div>
      </div>
      <u-button type="primary" plain :custom-style="{ height: '72rpx', borderRadius: '0' }" @click="buy">
        充值送会员
      </u-button>
    </div>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    buy() {
      this.$emit('update:show', false)
      this.$goto('/pages/my/balance')
    },
  },
}
</script>

<style></style>
