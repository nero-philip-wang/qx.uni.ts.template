<template>
  <div class="app">
    <div v-if="!loaded" class="m-32">
      <u-skeleton rows="16" title loading></u-skeleton>
    </div>
    <div v-if="loaded" class="text-lg my-16 mx-32">
      <span class="text-gray">{{ data.status | orderstatus }}</span>
      <span class="text-gray ml-4 text-lg">></span>
    </div>
    <!-- 物流信息 -->
    <div v-if="data.provider" class="rounded-sm my-16 p-24 bg-white text-base">
      服务人员：
      <div class="flex align-center pl-5 text-gray text-center">
        <image style="width: 120rpx; height: 150rpx" class="mr-16" mode="aspectFit" :src="data.provider.extraFields.avatar" />
        <div class="flex-grow">
          <div>工号</div>
          <div class="u-main-color">{{ data.provider.code }}</div>
        </div>
        <div class="flex-grow">
          <div>姓名</div>
          <div class="u-main-color">{{ data.provider.title }}</div>
        </div>
        <div class="flex-grow">
          <div>工龄</div>
          <div class="u-main-color">
            {{ ((Date.now() - Date.parse(data.provider.entryTime)) / 1000 / 3600 / 24 / 30 || 12).toFixed(1) }}个月
          </div>
        </div>
      </div>
    </div>

    <!-- 地址 -->
    <div v-if="loaded && data.deliveryType == 1" class="rounded-sm my-16 p-24 bg-white flex">
      <u-icon size="40rpx" name="map"></u-icon>
      <div class="ml-24 text-base">
        <div class="addr">{{ data.consignee.address }} </div>
        <div class="text-gray">{{ data.consignee.name }} {{ data.consignee.mobile }}</div>
      </div>
    </div>
    <!-- 自提二维码 -->
    <div v-if="loaded && data.deliveryType == 4" class="rounded-sm my-16 p-24 bg-white flex-col align-center justify-between">
      <qx-qrcode text="698155"> </qx-qrcode>
      <span class="my-8 text-lg text-bold text-black-38"> 698155</span>
      <span class="my-8 text-sm text-gray"> 提货时请出示提货码</span>
    </div>

    <!-- 商品 -->
    <div v-if="data.items && data.items.length" class="rounded-sm my-16 bg-white">
      <product-list v-for="item in data.items" :key="item.id" small :value="item"></product-list>
      <!-- 价格信息 -->
      <div class="text-black-38 text-base lineh-200p px-32 py-16">
        <div class="flex">
          <text class=" flex-grow">商品金额</text>
          <text>￥{{ data.itemAmount || 0 | yuan }}</text>
        </div>
        <div class="flex align-center">
          <u-tag text="促" size="mini" type="warning"></u-tag>
          <text class=" flex-grow">订单促销</text>
          <text>-￥{{ -data.promotionDiscount || 0 | yuan }}</text>
        </div>
        <div class="flex align-center">
          <u-tag text="券" size="mini" type="error"></u-tag>
          <text class="flex-grow">优惠券</text>
          <text>-￥{{ -data.couponDiscount || 0 | yuan }}</text>
        </div>

        <div class="flex">
          <text class="flex-grow">配送费</text>
          <text>￥{{ data.freightAmount || 0 | yuan }}</text>
        </div>

        <div class="flex">
          <text class="flex-grow">订单金额</text>
          <text class="text-price text-bold">￥{{ data.orderAmount || 0 | yuan }} </text>
          <text v-if="data.status == 1"> (已付 {{ data.orderAmount - data.paymentAmount || 0 | yuan }})</text>
        </div>
      </div>
    </div>

    <div v-if="loaded" class="rounded-sm my-16 p-24 bg-white text-base lineh-200p">
      <div class="flex">
        <text class="text-gray">订单编号：</text>
        <text class="text-black-38 flex-grow">{{ data.id || '' }}</text>
        <!-- #ifndef H5 -->
        <div>
          <u-button shape="circle" plain size="mini" text="复制" @click="copy(data.id)"></u-button>
        </div>
        <!-- #endif -->
      </div>
      <div class="flex">
        <text class="text-gray">下单时间：</text>
        <text class="text-black-38">{{ data.creationTime | timef }}</text>
      </div>
      <div v-for="(c, idx) in data.orderPayments.filter((i) => i.hasPaid)" :key="idx" class="flex">
        <text class="text-gray">支付方式：</text>
        <text class="text-black-38">{{ c.type | payment }} (￥{{ c.amount | yuan }}) </text>
      </div>
      <div v-if="data.buyerRemark" class="flex">
        <text class="text-gray">订单备注：</text>
        <text class="text-black-38">{{ data.buyerRemark || '' }}</text>
      </div>
    </div>
    <bottomBar>
      <orderBar :order="data" show-negative />
    </bottomBar>
  </div>
</template>

<script>
import { get } from '@/apis/modules/order.js'
import { get as getEmployee } from '@/apis/modules/employee.js'
import OrderMixin from './mixin/order.js'
import productList from '../cart/comp/cartItem.vue'
import bottomBar from './comp/bottom-bar.vue'
import orderBar from './mixin/order-bar.vue'

export default {
  components: {
    productList,
    bottomBar,
    orderBar,
  },
  mixins: [OrderMixin],
  data() {
    return {
      modalText: '', // 确认对话框内容
      addr: {
        address: {},
      },
      data: {
        products: [],
        price_data: {},
      },
      expressInfo: {}, // 物流信息
      loaded: false,
    }
  },
  onLoad(options) {
    this.id = options.id
    this.loadData()
  },
  methods: {
    async loadData() {
      const data = await get(this.id)
      data.items = data.items.map((c) => ({ ...c, id: c.itemSpuId }))

      //  处理发货人
      if (data.deliveryLog.length) {
        var last = data.deliveryLog[data.deliveryLog.length - 1]
        data.provider = { id: last.providerId, tilte: last.provider }
      }

      this.loaded = true
      this.data = data

      //  处理发货人
      if (data.provider) {
        this.data.provider = await getEmployee(data.provider.id)
      }
    },
    copy(str) {
      uni.setClipboardData({
        data: str,
      })
    },
  },
}
</script>
