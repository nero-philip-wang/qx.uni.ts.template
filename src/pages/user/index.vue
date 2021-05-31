<template>
  <view class="app">
    <view class="top">
      <image class="u-bg" src="/static/bg/user.jpg"></image>
      <view class="user-wrapper">
        <image class="avatar" :src="userInfo.avatar || '/static/icon/default-avatar.png'"></image>
        <view v-if="hasLogin" class="cen column">
          <text class="username f-m">{{ userInfo.nickname || userInfo.username }}</text>
          <text class="user-group">普通会员</text>
        </view>
        <view v-else class="login-box" @click="$goto('/pages/login/login')">
          <text>请登录</text>
        </view>
      </view>
      <image class="arc-line" src="/static/icon/arc.png" mode="aspectFill"></image>
    </view>

    <view class="money-wrap">
      <view class="item center" hover-class="hover-gray" :hover-stay-time="50" @click="$goto('/pages/user/rebate/index')">
        <text class="num">{{ 0 | yuan }}</text>
        <text>返利</text>
      </view>
      <view class="item center" hover-class="hover-gray" :hover-stay-time="50" @click="$goto('/pages/user/coupon')">
        <text class="num">{{ couponCount || 0 }}</text>
        <text>优惠券</text>
      </view>
      <!--  hover-class="hover-gray" :hover-stay-time="50" -->
      <view class="item center">
        <text class="num">{{ userInfo.score || 0 }}</text>
        <text>积分</text>
      </view>
    </view>
    <!-- 订单 -->
    <view class="order-wrap">
      <view class="o-header row" @click="navTo('/pages/order/list?current=0', { login: true })">
        <text class="tit">我的订单</text>
        <text class="more">查看全部</text>
        <text class="mix-icon icon-you"></text>
      </view>
      <view class="o-list">
        <view
          class="item center"
          hover-class="hover-gray"
          :hover-stay-time="50"
          @click="navTo('/pages/order/list?current=1', { login: true })"
        >
          <text class="mix-icon icon-daifukuan"></text>
          <text>待付款</text>
          <text v-if="orderCount.c0 > 0" class="number">{{ orderCount.c0 }}</text>
        </view>
        <view
          class="item center"
          hover-class="hover-gray"
          :hover-stay-time="50"
          @click="navTo('/pages/order/list?current=2', { login: true })"
        >
          <text class="mix-icon icon-daifahuo"></text>
          <text>待发货</text>
          <text v-if="orderCount.c1 > 0" class="number">{{ orderCount.c1 }}</text>
        </view>
        <view
          class="item center"
          hover-class="hover-gray"
          :hover-stay-time="50"
          @click="navTo('/pages/order/list?current=3', { login: true })"
        >
          <text class="mix-icon icon-yishouhuo"></text>
          <text>待收货</text>
          <text v-if="orderCount.c2 > 0" class="number">{{ orderCount.c2 }}</text>
        </view>
        <view
          class="item center"
          hover-class="hover-gray"
          :hover-stay-time="50"
          @click="navTo('/pages/order/list?current=4', { login: true })"
        >
          <text class="mix-icon icon-daipingjia"></text>
          <text>待评价</text>
          <text v-if="orderCount.c3 > 0" class="number">{{ orderCount.c3 }}</text>
        </view>
      </view>
    </view>
    <!-- 浏览历史 -->
    <view class="option-wrap">
      <view v-if="historyList.length > 0" class="sec-header row">
        <text class="mix-icon icon-lishijilu"></text>
        <text class="fill">浏览历史</text>
        <text class="mix-icon icon-lajitong" @click="showClearHistory = true">-</text>
      </view>
      <scroll-view v-if="historyList.length > 0" scroll-x class="h-scroll">
        <view class="pro-list row">
          <image
            v-for="(item, index) in historyList"
            :key="index"
            :src="item.thumb"
            mode="aspectFill"
            @click="navTo('/pages/product/detail?id=' + item.id)"
          ></image>
        </view>
      </scroll-view>

      <!-- <u-cell-item
        icon="icon-iconfontweixin"
        icon-color="#fa436a"
        title="我的钱包"
        @onClick="navTo('/pages/wallet/index', { login: true })"
      ></u-cell-item> -->
      <u-cell-item icon="icon-dizhi" icon-color="#5fcda2" title="地址管理" @click="$goto('/pages/consignee/list')"></u-cell-item>
      <!-- <u-cell-item icon="icon-share" iconColor="#9789f7" title="分享" tips="呼朋唤友赢好礼"></u-cell-item> -->
      <!-- <u-cell-item
        icon="icon-shoucang_xuanzhongzhuangtai"
        icon-color="#54b4ef"
        title="我的收藏"
        @onClick="navTo('/pages/favorite/favorite', { login: true })"
      ></u-cell-item> -->
      <button open-type="contact"> <u-cell-item icon="icon-pinglun-copy" icon-color="#ee883b" title="联系客服"></u-cell-item></button>
      <!-- <u-cell-item
        icon="icon-shezhi1"
        icon-color="#37b0fb"
        title="设置"
        border=""
        @onClick="navTo('/pages/set/set', { login: true })"
      ></u-cell-item> -->

      <u-modal
        v-model="showClearHistory"
        show-cancel-button
        content="确定要清空浏览记录吗"
        confirm-text="清空"
        @confirm="clearHistory"
      ></u-modal>
    </view>
  </view>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
// import tabbarMixin from './mixin/tabbar'

export default {
  // mixins: [tabbarMixin],
  data() {
    return {
      showClearHistory: false,
      historyList: [],
    }
  },
  computed: {
    ...mapState(['userInfo', 'orderCount', 'couponCount']),
    // ...mapGetters(['hasLogin']),
    hasLogin() {
      return false
    },
  },
  onShow() {
    this.loadHistory()

    // this.$store.dispatch('getUserInfo'); //更新订单数量
    // this.$store.dispatch('getOrderCount'); //更新订单数量
    // this.$store.dispatch('getCouponCount'); //更新优惠券数量
  },
  methods: {
    // 加载浏览记录
    loadHistory() {
      const list = uni.getStorageSync('productHistory')
      this.historyList = list || [{}]
    },
    // 清空浏览记录
    clearHistory() {
      uni.removeStorage({
        key: 'productHistory',
      })
      this.historyList = []
    },
  },
}
</script>

<style>
page {
  background-color: #f7f7f7;
}
</style>
<style scoped lang="scss">
.app {
  padding-bottom: 20rpx;
}
.top {
  position: relative;
  overflow: hidden;
  padding-top: calc(var(--status-bar-height) + 52rpx);
  padding-bottom: 6rpx;

  .u-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 330rpx;
  }
  .user-wrapper {
    display: flex;
    flex-direction: column;
    flex-direction: row;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 20rpx 30rpx 60rpx;
  }
  .login-box {
    font-size: 36rpx;
    color: #fff;
  }
  .avatar {
    flex-shrink: 0;
    width: 130rpx;
    height: 130rpx;
    border-radius: 100px;
    margin-right: 24rpx;
    border: 4rpx solid #fff;
    background-color: #fff;
  }
  .username {
    font-size: 34rpx;
    color: #fff;
  }
  .user-group {
    align-self: flex-start;
    padding: 10rpx 16rpx;
    margin-top: 16rpx;
    font-size: 20rpx;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 100rpx;
  }
  .arc-line {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9;
    width: 100%;
    height: 32rpx;
  }
}
.money-wrap {
  display: flex;
  justify-content: space-around;
  width: 700rpx;
  margin: 6rpx auto 0;
  padding: 14rpx 0;
  background: #fff;
  border-radius: 10rpx;

  .item {
    flex-direction: column;
    width: 130rpx;
    height: 120rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: #606266;
  }
  .num {
    margin-bottom: 20rpx;
    font-size: 32rpx;
    color: #333;
    font-weight: 700;
  }
}
.order-wrap {
  width: 700rpx;
  margin: 20rpx auto 0;
  background: #fff;
  border-radius: 10rpx;

  .o-header {
    padding: 28rpx 20rpx 6rpx 26rpx;

    .tit {
      flex: 1;
      font-size: 32rpx;
      color: #333;
      font-weight: 700;
    }
    .more {
      font-size: 24rpx;
      color: #999;
    }
    .icon-you {
      margin-left: 4rpx;
      font-size: 20rpx;
      color: #999;
    }
  }
  .o-list {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
  }
  .item {
    flex-direction: column;
    width: 130rpx;
    height: 130rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: #606266;
    position: relative;

    .mix-icon {
      font-size: 50rpx;
      margin-bottom: 20rpx;
      color: #fa436a;
    }
    .icon-shouhoutuikuan {
      font-size: 44rpx;
    }
  }
  .number {
    position: absolute;
    right: 22rpx;
    top: 6rpx;
    min-width: 34rpx;
    height: 34rpx;
    line-height: 30rpx;
    text-align: center;
    padding: 0 8rpx;
    font-size: 18rpx;
    color: #fff;
    border: 2rpx solid #fff;
    background-color: $base-color;
    border-radius: 100rpx;
  }
}
.option-wrap {
  width: 700rpx;
  margin: 20rpx auto 0;
  margin-top: 20rpx;
  background: #fff;
  border-radius: 10rpx;

  .sec-header {
    padding: 26rpx 14rpx 0 24rpx;
    font-size: 28rpx;
    color: #333;

    .icon-lishijilu {
      font-size: 46rpx;
      color: #50bf8b;
      margin-right: 16rpx;
      line-height: 40rpx;
    }
    .icon-lajitong {
      padding: 4rpx 10rpx;
      font-size: 36rpx;
      color: #999;
    }
  }
  .pro-list {
    flex-wrap: nowrap;
    padding: 20rpx 0 12rpx;

    &:before,
    &:after {
      content: '';
      min-width: 30rpx;
      height: 30rpx;
    }
    &:after {
      min-width: 20rpx;
    }
    image {
      flex-shrink: 0;
      width: 144rpx;
      height: 144rpx;
      margin-right: 16rpx;
      border-radius: 8rpx;
    }
  }
}
</style>
