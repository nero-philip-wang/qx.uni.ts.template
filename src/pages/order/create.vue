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
        <cartItem v-for="item in inputs.items" :key="item.id" :value="item" disabled-link></cartItem>
      </div>
      <!-- 价格信息 -->
      <div class="text-black-38 text-base lineh-200p px-32 py-16">
        <div class="flex">
          <text class=" flex-grow">商品金额</text>
          <text>￥{{ order.itemAmount || 0 | yuan }}</text>
        </div>
        <div class="flex align-center">
          <u-tag text="促" size="mini" type="warning"></u-tag>
          <text class=" flex-grow">订单促销</text>
          <text>-￥{{ -order.promotionDiscount || 0 | yuan }}</text>
        </div>
        <div class="flex align-center" @click="showCoupon = true">
          <u-tag text="券" size="mini" type="error"></u-tag>
          <text class="flex-grow">优惠券</text>

          <text v-if="order.coupons && order.coupons.length > 0" class="text-primary"> {{ order.coupons.length }}张可用 </text>
          <text
            v-if="!(order.coupons && order.coupons.length > 0) && !(order.selectedCoupons && order.selectedCoupons.length > 0)"
            class="text-gray"
          >
            暂无可用
          </text>
          <text v-if="order.couponDiscount" class="ml-9">-￥{{ -order.couponDiscount || 0 | yuan }}</text>
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
      <textarea v-model="inputs.buyerRemark" confirm-type="done" auto-height placeholder="有什么要求您尽管说~" class="remark my-16" />
    </div>

    <!-- 底部栏 -->
    <bottomBar>
      <div class="flex h-full align-center">
        <div class="flex-grow">
          <span class="text-gray">应付金额：</span>
          <span class="text-price text-bold">￥{{ order.orderAmount || 0 | yuan }}</span>
        </div>
        <div class="">
          <u-button
            :disabled="!order.id"
            :custom-style="{ padding: '0 40rpx' }"
            shape="circle"
            size="small"
            type="primary"
            text="提交订单"
            @click="createOrder"
          ></u-button>
        </div>
      </div>
    </bottomBar>

    <page-container :show="showTime || showCoupon" position="bottom" @afterleave=";(showTime = false), (showCoupon = false)">
      <timePicker v-model="selectDate" :show.sync="showTime" />
      <!-- 优惠券弹窗 -->
      <couponPicker v-model="inputs.selectedCoupons" :show.sync="showCoupon" :data="order.coupons" />
    </page-container>
  </div>
</template>

<script>
import cartItem from '../cart/comp/cartItem.vue'
import timePicker from './comp/time-picker.vue'
import couponPicker from './comp/coupon-picker.vue'
import bottomBar from './comp/bottom-bar.vue'

import OrderMixin from './mixin/order.js'
import { settle, create } from '@/apis/modules/billing'
import easyState from '@/store/easyState'

export default {
  components: {
    cartItem,
    bottomBar,
    couponPicker,
    timePicker,
  },
  mixins: [OrderMixin],
  data() {
    return {
      showTime: false, // 显示时间弹窗
      selectDate: null, // 商户时间
      showCoupon: false, // 显示优惠券弹窗
      order: {}, // 结算订单
      inputs: {
        // 结算输入信息
        consignee: {},
        items: [],
        selectedCoupons: [],
        buyerRemark: '',
      },
    }
  },
  computed: {},
  watch: {
    selectDate() {
      this.trySettle()
    },
    inputs: {
      deep: true,
      handler() {
        this.trySettle()
      },
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
    this.inputs.items = [...easyState.items]

    var hasItem = this.inputs.items && this.inputs.items.length
    // 非空购物车就结算
    if (hasItem) this.trySettle()
    // 空购物车就放弃并返回前一页
    else this.$goto(-1)
  },
  methods: {
    // 结算
    async trySettle() {
      var needDate = !(this.inputs.items && this.inputs.items[0].spu.type == 3) || this.selectDate
      if (this.inputs.consignee && this.inputs.consignee.mobile && needDate) {
        try {
          this.order = await settle({
            ...this.inputs,
          })
          console.log(this.order, '结算成功')
        } catch (error) {
          this.order = {}
          console.log(error, '结算失败')
        }
      }
    },
    // 创建订单
    async createOrder() {
      if (this.order && this.order.id && this.order.items) {
        try {
          await create({ ...this.order, buyerRemark: `${this.selectDate} ${this.inputs.buyerRemark}` })
          this.gopay(this.order)
          easyState.items = []
        } catch (error) {
          uni.showToast({ title: '订单创建繁忙，请稍后再试', icon: 'none', position: 'bottom', duration: 2000, mask: true })
        }
      } else {
        uni.showToast({ title: '请选择上门时间和地址', icon: 'none', position: 'bottom', duration: 2000, mask: true })
      }
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
