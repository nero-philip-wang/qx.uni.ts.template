<template>
  <view class="app">
    <view v-if="!openExamine">
      <view class="page-tit">
        <text>提现金额</text>
      </view>

      <view class="input-wrap row">
        <text>输入金额</text>
        <input v-model="money" type="number" maxlength="10" class="input" placeholder="请输入其他金额" placeholder-style="color: #999" />
      </view>

      <u-button shape="circle" margin-top="80rpx" @click="confirm">确认充值</u-button>
    </view>
  </view>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.page-tit {
  padding: 40rpx 0 30rpx 40rpx;
  font-size: 32rpx;
  color: #333;
  line-height: 48rpx;
  font-weight: 700;
}
.price-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 40rpx;

  .p-item {
    width: 160rpx;
    height: 78rpx;
    border-radius: 14rpx;
    margin-bottom: 20rpx;
    margin-right: 10rpx;
    background-color: #efefef;
    font-size: 28rpx;
    color: #999;
    border: 1rpx solid #d7d7d7;

    &.active {
      background: linear-gradient(131deg, #ff7e94, #fb4361);
      color: #fff;
      border: 0;
    }
  }
}
.input-wrap {
  height: 130rpx;
  padding: 10rpx 40rpx 0;
  font-size: 32rpx;
  color: #333;

  .input {
    flex: 1;
    text-align: right;
    font-size: 28rpx;
    color: #333;
  }
}
.cell {
  margin: 0 40rpx;
  height: 124rpx;

  .icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 32rpx;
  }
  .tit {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    font-weight: 700;
  }
  .tip {
    margin-top: 14rpx;
    font-size: 24rpx;
    color: #999;
  }
  .icon-xuanzhong {
    font-size: 36rpx;
    color: $base-color;
  }
}
</style>
