<template>
  <div class="px-24 py-8 text-base">
    <!-- 配送 -->
    <div class="my-16 bg-white rounded-sm overflow-hidden">
      <!-- 选择地址 -->
      <div v-if="!inputs.consignee.mobile" class="flex py-32 px-24 addrline" @click="$goto('/pages/consignee/list?choose=1')">
        <u-icon name="map"></u-icon>
        <span class="ml-8 text-gray">请选择收货地址</span>
      </div>
      <div v-else class="flex py-16 px-24 addrline" @click="$goto('/pages/consignee/list?choose=1')">
        <u-icon name="map"></u-icon>
        <div class="ml-8">
          <div class="mb-8 text-bold">{{ inputs.consignee.address }} </div>
          <div class="text-gray">{{ inputs.consignee.name }} {{ inputs.consignee.mobile }}</div>
        </div>
      </div>

      <!-- 选择时间 -->
      <div class="py-8">
        <u-cell-group :border="false">
          <u-cell title="上门时间" :border="false" :value="selectDate ? selectDate : ''" is-link @click="showTime = true"> </u-cell>
        </u-cell-group>
      </div>
    </div>

    <div class="my-16 bg-white rounded-sm overflow-hidden">
      <div class="item bb-1">
        <product-list :list="inOrder.items"></product-list>
      </div>
      <!-- 价格信息 -->
      <div class="text-black-38 text-base lineh-200p px-32 py-16">
        <div class="flex">
          <text class=" flex-grow">商品金额</text>
          <text>￥{{ order.itemAmount || 0 | yuan }}</text>
        </div>
        <div class="flex">
          <u-tag text="促" size="mini" type="warning"></u-tag>
          <text class=" flex-grow">订单促销</text>
          <text>-￥{{ -order.promotionDiscount || 0 | yuan }}</text>
        </div>
        <div class="flex">
          <u-tag text="券" size="mini" type="error"></u-tag>
          <text class="flex-grow">优惠券</text>
          <text>-￥{{ -order.couponDiscount || 0 | yuan }}</text>
        </div>

        <div class="flex">
          <text class="flex-grow">配送费</text>
          <text>￥{{ order.freightAmount || 0 | yuan }}</text>
        </div>

        <div class="flex">
          <text class="flex-grow">订单金额</text>
          <text class="text-price text-bold">￥{{ order.orderAmount || 0 | yuan }} </text>
        </div>
      </div>
    </div>

    <div class="my-16 bg-white rounded-sm overflow-hidden py-16 px-24">
      <span class="text-bold">订单备注：</span>
      <textarea v-model="remarks" confirm-type="done" auto-height placeholder="有什么要求您尽管说~" class="remark my-16" />
    </div>

    <!-- 底部栏 -->
    <bottomBar>
      <div class="flex h-full align-center">
        <div class="flex-grow">
          <span class="text-gray">应付金额：</span>
          <span class="text-price text-bold">￥{{ order.orderAmount || 0 | yuan }}</span>
        </div>
        <div class="">
          <u-button :custom-style="{ padding: '0 40rpx' }" shape="circle" size="small" type="primary" text="提交订单"></u-button>
        </div>
      </div>
    </bottomBar>

    <timePicker v-model="selectDate" :show.sync="showTime" />
    <!-- 优惠券弹窗 -->
    <coupon-select ref="couponSelect" :list="order.coupons" @confirm="onCheckCoupon"></coupon-select>
  </div>
</template>

<script>
import productList from '../cart/comp/cartItem.vue'
import couponSelect from './components/coupon-select.vue'
import timePicker from './comp/time-picker.vue'
// import timeSelector from '@/components/xiujun-time-selector/index.vue'
import { mapState } from 'vuex'
import { settle, create, setItems } from '@/apis/modules/billing'
import OrderMixin from './mixin/order.js'
import bottomBar from './comp/bottom-bar.vue'
import easyState from '@/store/easyState'

export default {
  components: {
    productList,
    couponSelect,
    bottomBar,
    // timeSelector,
    timePicker,
  },
  mixins: [OrderMixin],
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
      selectDate: null,
      selectedCoupons: [],
      order: {},
      inputs: {
        consignee: {},
      },
    }
  },
  computed: {
    ...mapState({
      // inOrder: (state) => state.billing.orderCreateDto,
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
    selectDate() {
      this.trySettle()
    },
  },
  onLoad(options) {
    // if (options.type === 'cart') {
    //   // 购物车结算
    //   this.createType = 'cart'
    // } else {
    //   this.createType = 'buyNow'
    // }
  },
  onShow() {
    this.inputs.consignee = Object.assign({}, easyState.address)
    this.inputs.items = Object.assign({}, easyState.items)
    console.log(this.inputs)
    // var hasItem = this.inOrder.items && this.inOrder.items.length
    // // 非空购物车就结算
    // if (hasItem) this.trySettle()
    // // 空购物车就放弃并返回前一页
    // else this.$goto(-1)
  },
  methods: {
    async trySettle() {
      var needDate = !(this.inOrder.items && this.inOrder.items[0].spu.type == 3) || this.selectDate
      if (this.inOrder.consignee && this.inOrder.consignee.mobile && needDate) {
        try {
          this.order = await settle({
            ...this.inOrder,
            buyerRemark: this.selectDate,
            selectedCoupons: this.selectedCoupons,
          })
          console.log(this.order, 'order')
        } catch (error) {
          console.log(error, 'error')
        }
      }
    },
    // 创建订单
    async createOrder() {
      if (this.order && this.order.id && this.order.items) {
        this.order.buyerRemark = this.selectDate + '   ' + this.remarks
        await create(this.order)
        this.gopay(this.order)
        setItems([])
      } else {
        uni.showToast({ title: '请选择上门时间和地址', icon: 'none', position: 'bottom', duration: 2000, mask: true })
      }
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
    async onCheckCoupon(selected) {
      this.selectedCoupons = selected.map((c) => c.id)
      await this.trySettle()
    },
  },
}
</script>

<style scoped lang="scss">
.addrline {
  background: url('/static/img/addr-line.png') repeat-x bottom;
  background-size: contain;
}
.remark {
  min-height: 70rpx;
}
</style>
