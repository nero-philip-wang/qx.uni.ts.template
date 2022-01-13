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
        <div class="flex" @click="showCoupon = true">
          <u-tag text="券" size="mini" type="error"></u-tag>
          <text class="flex-grow">优惠券</text>

          <text v-if="order.coupons && order.coupons.length > 0" class="price red" style="font-weight: normal;">
            可用{{ order.coupons.length }}张
          </text>
          <text
            v-if="!(order.coupons && order.coupons.length > 0) && !(order.selectedCoupons && order.selectedCoupons.length > 0)"
            class="price disabled"
          >
            暂无可用
          </text>

          <text v-if="order.couponDiscount">-￥{{ -order.couponDiscount || 0 | yuan }}</text>
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
      <couponPicker :show.sync="showCoupon" :data="order.coupons" />
    </page-container>
  </div>
</template>

<script>
import productList from '../cart/comp/cartItem.vue'
import timePicker from './comp/time-picker.vue'
import couponPicker from './comp/coupon-picker.vue'

import { mapState } from 'vuex'
import { settle, create } from '@/apis/modules/billing'
import OrderMixin from './mixin/order.js'
import bottomBar from './comp/bottom-bar.vue'
import easyState from '@/store/easyState'

export default {
  components: {
    productList,
    bottomBar,
    couponPicker,
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
      showCoupon: false,
      selectedCoupons: [],
      order: {},
      inputs: {
        consignee: {},
        items: [],
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
    inputs() {
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
    this.inputs.items = [...easyState.items]
    // this.inputs.consignee = {
    //   id: '4',
    //   userId: null,
    //   memberId: '4',
    //   name: '戴超',
    //   mobile: '17092559564',
    //   postCode: 460105,
    //   address: '海南省 海口市 秀英区 海港北路 海口港轮渡码头',
    //   room: '2075',
    //   position: { y: 20.022045, x: 110.28318, srid: 4326 },
    //   idNumber: null,
    //   isDefault: false,
    // }

    // this.inputs.items = [
    //   {
    //     id: '131',
    //     title: '焕新套餐 ',
    //     tenantId: '1000',
    //     code: null,
    //     barCode: null,
    //     cover: 'https://s.re4.top/upload/unimall/item/covers/ABBC63uXjBQ=.jpg',
    //     spuAttr: {},
    //     weight: 0,
    //     retailPrice: 59900,
    //     cost: null,
    //     stockQuantity: 9733,
    //     quantity: 1,
    //     spu: {
    //       rebate: {
    //         details: { rate: 0.07, amountCondition: 1 },
    //         id: '1',
    //         type: 1,
    //         title: '笔笔返',
    //         subTitle: '笔笔返',
    //         description: null,
    //         cover: null,
    //         image: null,
    //         start: '2021-07-01T19:40:45+08:00',
    //         end: '2022-07-31T19:40:56+08:00',
    //         enabled: true,
    //         isHot: false,
    //         sort: 100,
    //         isAllItems: true,
    //         includeItems: [],
    //       },
    //       rating: { all: 2, rating: '100%' },
    //       id: '151',
    //       freightTemplate: {
    //         id: '1',
    //         enabledDeliveryType: 15,
    //         title: '海口默认',
    //         isFree: false,
    //         details: [{ id: '1', deliveryType: 15, areas: [4601], fee: 0, freeCondition: 0, canDeliver: true }],
    //       },
    //       title: '焕新套餐',
    //       subTitle: null,
    //       description: '1月10号到1月31号大扫除火热预订中',
    //       tags: [],
    //       specifications: [],
    //       type: 3,
    //       canAddCart: false,
    //       covers: ['https://s.re4.top/upload/unimall/item/covers/ABBC63uXjBQ=.jpg'],
    //       cover: 'https://s.re4.top/upload/unimall/item/covers/ABBC63uXjBQ=.jpg',
    //       video: null,
    //       content: ['https://s.re4.top/upload/unimall/item/content/ABDCRu9vcxQ=.jpg'],
    //       brand: null,
    //       origin: null,
    //       catalogCode: 2,
    //       tenantId: '1000',
    //       status: true,
    //       markingPrice: 98800,
    //       minRetailPrice: 59900,
    //       freightTemplateId: '1',
    //       unit: null,
    //       sort: 8888,
    //       skus: [
    //         {
    //           id: '131',
    //           title: '焕新套餐 ',
    //           tenantId: '1000',
    //           code: null,
    //           barCode: null,
    //           cover: 'https://s.re4.top/upload/unimall/item/covers/ABBC63uXjBQ=.jpg',
    //           spuAttr: {},
    //           weight: 0,
    //           retailPrice: 59900,
    //           cost: null,
    //           stockQuantity: 9733,
    //         },
    //       ],
    //     },
    //     itemId: '131',
    //   },
    // ]

    var hasItem = this.inputs.items && this.inputs.items.length
    // 非空购物车就结算
    if (hasItem) this.trySettle()
    // 空购物车就放弃并返回前一页
    else this.$goto(-1)
  },
  methods: {
    async trySettle() {
      var needDate = !(this.inputs.items && this.inputs.items[0].spu.type == 3) || this.selectDate
      if (this.inputs.consignee && this.inputs.consignee.mobile && needDate) {
        try {
          this.order = await settle({
            ...this.inputs,
            buyerRemark: `${this.selectDate} ${this.remarks}`,
            selectedCoupons: this.selectedCoupons,
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
          await create(this.order)
          this.gopay(this.order)
          easyState.items = []
        } catch (error) {
          uni.showToast({ title: '订单创建繁忙，请稍后再试', icon: 'none', position: 'bottom', duration: 2000, mask: true })
        }
      } else {
        uni.showToast({ title: '请选择上门时间和地址', icon: 'none', position: 'bottom', duration: 2000, mask: true })
      }
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
