<template>
  <div class="flex fixed place-items-center">
    <div class="icon flex-col align-center text-center" @click="$goto('pages/index/index/labor')">
      <u-icon name="home" size="48rpx" />
      <span class="text-sm">首页</span>
    </div>

    <div class="icon flex-col align-center text-center" @click="$goto('pages/index/index/labor')">
      <u-icon name="shopping-cart" size="48rpx" />
      <span class="text-sm">购物车</span>
    </div>

    <button class="icon flex-col align-center text-center u-reset-button" open-type="contact" show-message-card>
      <u-icon name="kefu-ermai" size="48rpx" />
      <span class="text-sm">客服</span>
    </button>

    <div class="flex-grow pl-32 pr-16 flex">
      <div class="pr-24 btn">
        <u-button plain type="primary" text="加入购物车" :custom-style="{ height: '72rpx', borderRadius: '0' }"></u-button>
      </div>
      <div class="btn">
        <u-button type="primary" text="立即购买" :custom-style="{ height: '72rpx', borderRadius: '0' }"></u-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.fixed {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 90;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx 0 rgba(0, 0, 0, 0.1);
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .icon {
    width: 88rpx;
    margin: 4rpx;
  }
  .btn {
    width: 200rpx;
  }
}
</style>
