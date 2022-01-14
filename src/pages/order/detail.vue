<template>
  <div class="app">
    <div class="text-lg my-16 mx-32">
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
    <div class="rounded-sm my-16 p-24 bg-white flex">
      <u-icon size="40rpx" name="map"></u-icon>
      <div class="ml-24 text-base">
        <div class="addr">{{ data.consignee.address }} </div>
        <div class="text-gray">{{ data.consignee.name }} {{ data.consignee.mobile }}</div>
      </div>
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

    <div class="rounded-sm my-16 p-24 bg-white text-base lineh-200p">
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
      <div v-if="data.pay_type" class="flex">
        <text class="text-gray">支付方式：</text>
        <text class="text-black-38">{{
          data.pay_type === 'wxpay' ? '微信支付' : data.pay_type === 'alipay' ? '支付宝支付' : '余额支付'
        }}</text>
      </div>
      <div v-if="data.buyerRemark" class="flex">
        <text class="text-gray">订单备注：</text>
        <text class="text-black-38">{{ data.buyerRemark }}</text>
      </div>
    </div>

    <div class="fixed py-16 flex">
      <button class="ml-32 text-center u-reset-button" open-type="contact" show-message-card>
        <u-button shape="circle" plain size="small" text="客服"></u-button>
      </button>
      <!-- <div
          v-if="data.status === 4 || data.status === 10 || data.status === 11 || data.status === 14"
          class="btn center round"
          @click="deleteOrder(data)"
        >
          <text>删除订单</text>
        </div> -->
      <div class="flex-grow"></div>
      <div v-if="data.status === 1" class="btn center round" @click="cancel(data)">
        <u-button shape="circle" type="primary" plain size="small" text="取消订单"></u-button>
      </div>
      <div v-if="data.status === 1" class="btn center" @click="gopay(data)">
        <u-button shape="circle" type="primary" size="small" text="立即支付"></u-button>
      </div>
      <!-- #ifdef MP -->
      <!-- <button type="default" open-type="contact">
          <div v-if="data.status === 1" class="btn center round" @click="cancelOrder(item)">
            <text>联系客服</text>
          </div>
        </button> -->
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <!-- <div v-if="data.status === 1" class="btn center round" @click="showRefundAction(data)">
          <text>申请退款</text>
        </div> -->
      <!-- #endif -->
      <!-- <div v-if="data.status===1" class="btn center round" @click="$goto('zizhufahuo?id='+data._id)">
					<text>自助发货</text>
				</div> -->
      <!-- <div v-if="data.status === 2" class="btn center round" @click="$gotoExpress(data)">
          <text>查看物流</text>
        </div>
        <div v-if="data.status === 2" class="btn center" @click="confirmReceipt(data)">
          <text>确认收货</text>
        </div>
        <div v-if="data.status === 3" class="btn center" @click="rate(data)">
          <text>立即评价</text>
        </div> -->
      <div v-if="data.status === 3" class="btn center" @click="confirmReceipt(data)">
        <u-button shape="circle" type="primary" size="small" text="确认服务"></u-button>
      </div>
      <div v-if="data.status === 4" class="btn center" @click="gotoComment(data.id)">
        <u-button shape="circle" type="primary" size="small" text="立即评价"></u-button>
      </div>
      <div class="mr-32"></div>
    </div>

    <!-- 时间轴 -->
    <!-- <uni-popup v-if="data.timeline" ref="timelinePopup">
      <div class="timeline-content">
        <scroll-div class="timeline-scroll" scroll-y="true">
          <mix-timeline :list="data.timeline"></mix-timeline>
        </scroll-div>
        <text class="mix-icon icon-guanbi1" @click="hidePopup('timelinePopup')"></text>
      </div>
    </uni-popup> -->

    <!-- <mix-loading v-if="isLoading"></mix-loading> -->

    <!-- <mix-modal ref="mixModal" title="订单提示" :text="modalText" @onConfirm="onModalConfirm"></mix-modal> -->
    <!-- <mix-action-sheet ref="mixActionSheet" @onConfirm="refund"></mix-action-sheet> -->
  </div>
</template>

<script>
import { get } from '@/apis/modules/order.js'
import { get as getEmployee } from '@/apis/modules/employee.js'
import OrderMixin from './mixin/order.js'
import productList from '../cart/comp/cartItem.vue'

export default {
  components: {
    productList,
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
      this.loaded = true
      // if(res.status === 0){
      // 	this.$util.msg('订单不存在');
      // 	setTimeout(()=>{
      // 		uni.navigateBack();
      // 	}, 1000)
      // 	return;
      // }
      // const data = res.data;

      //   if (data.express_info && data.express_info.data && data.express_info.data.length > 0) {
      //     this.expressInfo = data.express_info.data[0]
      //   }
      if (data.deliveryLog.length) {
        var last = data.deliveryLog[data.deliveryLog.length - 1]
        data.provider = { id: last.providerId, tilte: last.provider }
      }

      this.data = data

      if (data.provider) {
        this.data.provider = await getEmployee(data.provider.id)
      }

      //   console.log(JSON.parse(JSON.stringify(data)))
      //   this.addr = data.address
    },
    copy(str) {
      uni.setClipboardData({
        data: str,
      })
    },
  },
}
</script>
