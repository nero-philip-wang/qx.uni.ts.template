<template>
  <u-popup v-model="isPopup" mode="bottom">
    <view class="wrap">
      <view class="s-header center">
        <text class="btn" @click="close"> &nbsp;</text>
        <text>请选择优惠券</text>
        <text class="btn" @click="confirm"> &nbsp; </text>
      </view>
      <scroll-view class="scroll-view" scroll-y="true">
        <u-divider v-if="selected && selected.length">已选优惠券</u-divider>

        <view v-for="(item, index) in selected" :key="index" class="coupon-item" @click="checkCoupon(item)">
          <view class="con">
            <view class="left">
              <text class="title clamp">{{ item.title }}</text>
              <text class="time">有效期至 {{ item.endTime | datef }}</text>
            </view>
            <view class="right">
              <text v-if="item.minus" class="price">{{ item.minus | yuan }}</text>
              <text v-else class="price">{{ (item.discount * 10).toFixed(0) }} 折</text>
              <text v-if="item.quantityCondition">满{{ item.quantityCondition }}件可用</text>
              <text v-else>满{{ item.amountCondition || 0 | yuan }}元可用</text>
            </view>

            <view class="circle l"></view>
            <view class="circle r"></view>
          </view>
          <view class="bot row">
            <text v-if="item.isAllItems" class="tips">平台所有商品可用</text>
          </view>
        </view>

        <u-divider v-if="availlist && availlist.length">可选优惠券</u-divider>

        <view v-for="(item, index) in availlist" :key="index" class="coupon-item" @click="checkCoupon(item)">
          <view class="con">
            <view class="left">
              <text class="title clamp">{{ item.title }}</text>
              <text class="time">有效期至 {{ item.endTime | datef }}</text>
            </view>
            <view class="right">
              <text v-if="item.minus" class="price">{{ item.minus | yuan }}</text>
              <text v-else class="price discount"
                >{{
                  (item.discount * 10).toFixed(1).endsWith('.0') ? (item.discount * 10).toFixed(0) : (item.discount * 10).toFixed(1)
                }}
                折</text
              >
              <text v-if="item.quantityCondition">满{{ item.quantityCondition }}件可用</text>
              <text v-else>满{{ item.amountCondition || 0 | yuan }}元可用</text>
            </view>

            <view class="circle l"></view>
            <view class="circle r"></view>
          </view>
          <view class="bot row">
            <text v-if="item.isAllItems" class="tips">平台所有商品可用</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script>
/**
 * 优惠券选择弹窗
 * @prop {Array} list 用户可用优惠券列表
 */
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      curCoupon: {},
      isPopup: false,
      loading: true,
      selected: [],
    }
  },
  computed: {
    availlist() {
      return this.list.filter((c) => this.selected.indexOf(c) == -1)
    },
  },
  methods: {
    // 确定选择
    confirm() {
      this.$emit('confirm', this.curCoupon)
      this.close()
    },
    // 选择优惠券
    checkCoupon(item) {
      if (this.selected.indexOf(item) == -1) this.selected.push(item)
      else this.selected.splice(this.selected.indexOf(item), 1)
      uni.showLoading({
        title: '正在加载...',
      })
      this.$emit('confirm', this.selected)
    },
    open(type) {
      this.isPopup = true
    },
    close() {
      this.isPopup = false
    },
  },
}
</script>

<style scoped lang="scss">
.wrap {
  padding-bottom: 10rpx;
  border-radius: 16rpx 16rpx 0 0;
  background-color: #f7f7f7;
}
.s-header {
  justify-content: space-between;
  padding: 30rpx 0 14rpx;
  font-size: 32rpx;
  color: #333;
  font-weight: 700;

  .btn {
    padding: 10rpx 36rpx;
    font-size: 28rpx;
    color: #666;
    font-weight: normal;

    &:last-child {
      color: $base-color;
    }
  }
}
.scroll-view {
  min-height: 50vh;
  max-height: 70vh;
}
.coupon-item {
  display: flex;
  flex-direction: column;
  margin: 20rpx 24rpx;
  background: #fff;

  .con {
    display: flex;
    align-items: center;
    position: relative;
    height: 140rpx;
    padding: 0 30rpx;

    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      width: 100%;
      height: 0;
      border-bottom: 1px dashed #e5e5e5;
      transform: scaleY(50%);
    }
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    height: 100rpx;
  }
  .title {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 24rpx;
  }
  .time {
    font-size: 24rpx;
    color: #999;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 30rpx;
    font-size: 24rpx;
    color: #666;
    height: 100rpx;
  }
  .price {
    margin-bottom: 14rpx;
    font-size: 50rpx;
    color: $base-color;
    font-weight: 700;

    &:before {
      content: '￥';
      font-size: 34rpx;
    }
  }
  .price.discount {
    &:before {
      content: '';
    }
  }
  .bot {
    height: 72rpx;
    padding: 0 28rpx 0 30rpx;

    .tips {
      flex: 1;
      font-size: 24rpx;
      color: #999;
    }
    .icon-xuanzhong {
      font-size: 36rpx;
      color: $base-color;
    }
  }

  .circle {
    position: absolute;
    left: -6rpx;
    bottom: -10rpx;
    z-index: 10;
    width: 20rpx;
    height: 20rpx;
    background: #f3f3f3;
    border-radius: 100px;

    &.r {
      left: auto;
      right: -6rpx;
    }
  }
}
</style>
