<template>
  <div>
    <div class="placehold"></div>
    <div class="bar flex-col justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.placehold {
  width: 100%;
  height: 100rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.bar {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 90;
  width: 100%;
  height: 100rpx;
  padding: 10rpx 32rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx 0 rgba(0, 0, 0, 0.06);
  //   padding-bottom: constant(safe-area-inset-bottom);
  //   padding-bottom: env(safe-area-inset-bottom);
}
</style>
