<template>
  <view class="app column">
    <view class="main-wrap" :class="{ show: loaded }">
      <view class="addr-sec" @click="$goto('/pages/consignee/list?choose=1')">
        <view v-if="!inOrder.consignee.mobile" class="addr-empty row fill">
          <text class="mix-icon icon-dizhi"></text>
          <text>请选择收货地址</text>
        </view>
        <view v-else class="addr-wrap">
          <text class="mix-icon icon-dizhi"></text>
          <view class="con column">
            <text class="addr">{{ inOrder.consignee.address }} </text>
            <text class="name">{{ inOrder.consignee.name }} {{ inOrder.consignee.mobile }}</text>
          </view>
        </view>
        <text class="mix-icon icon-you"></text>
        <image class="bg" src="/static/icon/addr-line.png"></image>
      </view>
      <u-cell-group>
        <u-cell-item title="上门时间" @click="showTime = true">
          {{ selectDate ? selectDate : '请选择上门时间' }}
        </u-cell-item>
        <u-popup v-model="showTime" mode="bottom">
          <time-selector
            :time-slot="0"
            @change="
              (value) => {
                showTime = false
                selectDate = value
              }
            "
          />
        </u-popup>
      </u-cell-group>
      <!-- 商品列表 -->
      <view class="goods-sec">
        <product-list :list="inOrder.items"></product-list>
      </view>
      <!-- 价格信息 -->
      <view class="price-sec">
        <view class="cell row">
          <text class="tit fill">商品金额</text>
          <text class="price">￥{{ order.itemAmount || 0 | yuan }}</text>
        </view>
        <view class="cell row">
          <text class="tag">满</text>
          <text class="tit fill">订单满减</text>
          <text class="price" :class="{ red: fullReductionMoney > 0 }">-￥{{ -order.promotionDiscount || 0 }}</text
          ><!-- red -->
        </view>
        <view class="cell row" @click="showCouponPopup">
          <text class="tag red">券</text>
          <text class="tit fill">优惠券</text>
          <text v-if="data.coupons.length === 0" class="price disabled">暂无可用</text>
          <template v-else>
            <text v-if="curCoupon._id" class="price red">-￥{{ order.couponDiscount || 0 | yuan }}</text>
            <text v-else class="price red" style="font-weight: normal;">请选择优惠券</text>
            <text class="mix-icon icon-you"></text>
          </template>
        </view>
        <!-- <view class="cell row">
          <text class="tit fill">配送费</text>
          <text class="price">￥0</text>
        </view>
        <view class="total row b-t">
          <text class="price">￥{{ payTotal | yuan }}</text>
        </view> -->
      </view>
      <view class="remarks column">
        <text class="title">订单备注：</text>
        <textarea v-model="remarks" class="input" auto-height placeholder="有什么提醒您尽管说~" placeholder-style="color: #999" />
      </view>
      <!-- 底部栏 -->
      <view class="bot-fill-view"></view>
      <view class="bottom row">
        <view class="fill">
          <text class="tip">实付款：</text>
          <text class="price fill">￥{{ order.orderAmount || 0 | yuan }}</text>
        </view>
        <view class="btn center" @click="createOrder">
          <text>提交订单</text>
        </view>
      </view>
    </view>
    <!-- 优惠券弹窗 -->
    <coupon-select ref="couponSelect" :list="data.coupons" @confirm="onCheckCoupon"></coupon-select>

    <mix-loading v-if="isLoading" :type="loaded ? 1 : 2" :mask="true"></mix-loading>
  </view>
</template>

<script>
import productList from './components/product-list.vue'
import couponSelect from './components/coupon-select.vue'
import timeSelector from '@/components/xiujun-time-selector/index.vue'
import { mapState } from 'vuex'
import { settle, create } from '@/apis/modules/billing'
export default {
  components: {
    productList,
    couponSelect,
    timeSelector,
  },
  data() {
    return {
      loaded: true,
      remarks: '', // 备注
      addr: {}, // 地址信息
      data: {
        products: [],
        coupons: [],
      },
      curCoupon: {},
      payTotal: 0, // 支付价格
      fullReductionMoney: 0, // 满减金额
      showTime: false,
      selectDate: '',
      order: {},
    }
  },
  computed: {
    ...mapState({
      inOrder: (state) => state.billing.orderCreateDto,
    }),
    // 商品总价
    goodsTotal() {
      if (this.data.products.length === 0) {
        return 0
      }
      let total = 0
      this.data.products.forEach((item) => {
        total += item.price * item.number
      })
      return total
    },
  },
  watch: {
    inOrder() {
      this.trySettle()
    },
    showTime() {
      this.trySettle()
    },
  },
  onLoad(options) {
    if (options.type === 'cart') {
      // 购物车结算
      this.createType = 'cart'
      this.cartIds = options.ids
    } else {
      this.createType = 'buyNow'
      this.buyData = JSON.parse(options.data)
    }
    this.loadData()
  },
  methods: {
    async trySettle() {
      if (this.inOrder.consignee && this.inOrder.consignee.mobile && this.selectDate) {
        this.order = await settle({ ...this.inOrder, buyerRemark: this.selectDate })
      }
    },
    async loadData() {
      const operation = this.createType === 'cart' ? 'getCartConfirmData' : 'getBuyNowConfirmData'
      const sendData =
        this.createType === 'cart'
          ? {
              ids: this.cartIds.split(','),
            }
          : this.buyData
      const res = await this.$request('order', operation, sendData, { showLoading: true })
      this.addr = res.data.address
      this.data = res.data

      console.log(JSON.parse(JSON.stringify(res.data)))

      this.getOrderPayPrice()
    },
    // 计算订单价格
    async getOrderPayPrice() {
      const res = await this.$request(
        'order',
        'getOrderPayPrice',
        {
          goods_price: this.goodsTotal,
          address_id: this.addr._id || '',
          coupon_id: this.curCoupon._id || '',
        },
        { showLoading: this.payTotal > 0 }
      )
      this.payTotal = res.pay_price || 0
      this.fullReductionMoney = res.full_reduction_money
    },
    // 创建订单
    async createOrder() {
      await create(this.order)
      // this.$util.throttle(async () => {
      //   if (!this.addr._id) {
      //     this.$util.msg('请选择收货地址')
      //     return
      //   }
      //   this.isLoading = true
      //   const data = this.getCreateData()
      //   const operation = this.createType === 'cart' ? 'addByCart' : 'addBuyNow'
      //   const res = await this.$request('order', operation, data)
      //   this.isLoading = false
      //   console.log(JSON.parse(JSON.stringify(res)))
      //   if (res.status === 1) {
      //     if (this.createType === 'cart') {
      //       uni.$emit('refreshCart') // 刷新购物车
      //       this.$store.dispatch('getCartCount') // 刷新购物车数量个
      //     }
      //     uni.redirectTo({
      //       url:
      //         '/pages/wallet/pay?data=' +
      //         JSON.stringify({
      //           sourcePage: 'createOrder',
      //           ...res.data,
      //         }),
      //     })
      //   } else {
      //     this.$util.msg(res.msg)
      //   }
      // })
    },
    // 获取创建订单参数
    getCreateData() {
      const data = {
        remarks: this.remarks,
        address: this.addr,
        coupon_id: this.curCoupon._id || '',
        // #ifdef H5
        source_type: 1,
        // #endif
        // #ifdef APP-PLUS
        source_type: 2,
        // #endif
        // #ifdef MP-WEIXIN
        source_type: 3,
        // #endif
      }
      // 购物车结算
      if (this.createType === 'cart') {
        data.ids = this.cartIds.split(',')
      } else {
        data.product = this.data.products[0]
      }
      return data
    },
    // 设置收货地址
    setAddress(addr) {
      this.addr = addr
      this.getOrderPayPrice()
    },
    // 打开优惠券弹窗
    showCouponPopup() {
      // if (this.data.coupons.length > 0) {
      this.$refs.couponSelect.curCoupon = this.curCoupon
      this.$refs.couponSelect.open()
      // }
    },
    // 优惠券选择回调
    onCheckCoupon(curCoupon) {
      this.curCoupon = curCoupon
      this.getOrderPayPrice()
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
.b-b:after {
  left: 4rpx;
  right: 4rpx;
  border-color: #ececec;
}
.app {
  padding: 16rpx 24rpx 20rpx;
}
.main-wrap {
  opacity: 0;
  transition: 0.2s;

  &.show {
    opacity: 1;
  }
}
.addr-sec {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  position: relative;
  overflow: hidden;

  .addr-empty {
    margin: 16rpx 0 24rpx;
    font-size: 30rpx;
    color: #666;

    .icon-dizhi {
      transform: translateY(0rpx);
      margin-right: 16rpx;
    }
  }
  .addr-wrap {
    display: flex;
    flex: 1;
  }
  .icon-dizhi {
    transform: translateY(6rpx);
    font-size: 32rpx;
    color: $base-color;
  }
  .icon-you {
    flex-shrink: 0;
    transform: translateY(50%);
    position: relative;
    top: -14rpx;
    font-size: 26rpx;
    color: #999;
  }
  .con {
    flex: 1;
    padding: 0 80rpx 10rpx 20rpx;
  }
  .addr {
    margin-bottom: 16rpx;
    font-size: 30rpx;
    color: #333;
    line-height: 1.4;
    font-weight: 700;
  }
  .name {
    font-size: 28rpx;
    color: #999;
  }
  .bg {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4rpx;
  }
}
.goods-sec {
  margin-top: 16rpx;
  background-color: #fff;
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;
}
.price-sec {
  padding-top: 14rpx;
  border-radius: 0 0 10rpx 10rpx;
  background-color: #fff;

  .cell {
    height: 68rpx;
    padding: 0 24rpx;
    font-size: 26rpx;
    color: #333;
  }
  .price {
    font-weight: 700;

    &.red {
      color: $base-color;
    }
    &.disabled {
      color: #999;
      font-weight: normal;
    }
  }
  .total {
    justify-content: flex-end;
    height: 80rpx;
    padding-right: 20rpx;
    margin-top: 16rpx;
    font-size: 30rpx;
    color: #333;

    .price:before {
      content: '小计：';
      font-weight: normal;
    }
  }
  .tag {
    padding: 6rpx 8rpx;
    margin-right: 8rpx;
    font-size: 20rpx;
    color: #fff;
    border-radius: 8rpx;
    background-color: orange;

    &.red {
      background-color: $base-color;
    }
  }
  .icon-you {
    margin-left: 8rpx;
    font-size: 20rpx;
    color: #999;
  }
}
.remarks {
  padding: 24rpx 24rpx;
  margin-top: 16rpx;
  border-radius: 12rpx;
  background-color: #fff;

  .title {
    margin-bottom: 24rpx;
    font-size: 30rpx;
    color: #333;
    font-weight: 700;
  }
  .input {
    flex: 1;
    min-height: 140rpx;
    font-size: 28rpx;
    color: #333;
  }
}
.bot-fill-view {
  width: 100%;
  height: 100rpx;
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 90;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx 0 rgba(0, 0, 0, 0.06);
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .tip {
    margin-left: 24rpx;
    font-size: 28rpx;
    color: #999;
  }
  .price {
    margin-right: 30rpx;
    font-size: 36rpx;
    color: $base-color;
    font-weight: 700;
    text-align: right;
  }
  .btn {
    min-width: 180rpx;
    height: 70rpx;
    padding: 0 26rpx;
    margin-right: 20rpx;
    border-radius: 100rpx;
    background-color: $base-color;
    font-size: 30rpx;
    color: #fff;
  }
}
</style>
