<template>
  <div class="page">
    <div class="text-center py-80">
      <div class="mb-32 text-lg text-black-38">还需支付</div>
      <div class="text-xxl text-price">
        <span class="mr-8 text-xl">¥</span>
        <span>{{ cash | yuan }}</span>
      </div>
    </div>
    <div class="bg-white">
      <u-cell-group>
        <u-cell
          v-if="getAsset(23) && getAsset(23).balance"
          icon="rmb-circle-fill"
          icon-size="64rpx"
          title="返利钱包"
          :arrow="false"
          @click="changePay(1)"
        >
          <div slot="value" class="flex">
            <span v-if="walletDiscount" class="pr-12">抵扣¥{{ walletDiscount | yuan }}</span>
            <u-checkbox-group :value="[!!(isWallet && walletDiscount)]" @change="changePay(1)">
              <u-checkbox :name="true"> </u-checkbox>
            </u-checkbox-group>
          </div>
          <div slot="label" class="text-gray">
            <span>您的余额：¥{{ getAsset(23) && getAsset(23).balance | yuan }} </span>
          </div>
        </u-cell>

        <u-cell
          v-if="getAsset(21) && getAsset(21).balance"
          icon="red-packet-fill"
          icon-size="64rpx"
          title="账户余额"
          :arrow="false"
          use-label-slot
          @click="changePay(2)"
        >
          <div slot="value" class="flex">
            <span v-if="balanceDiscount" class="pr-12">抵扣¥{{ balanceDiscount | yuan }}</span>
            <u-checkbox-group :value="[!!(isBalance && balanceDiscount)]" @change="changePay(2)">
              <u-checkbox :name="true"> </u-checkbox>
            </u-checkbox-group>
          </div>
          <div slot="label" class="text-gray">
            <span>您的余额：¥{{ getAsset(21) && getAsset(21).balance | yuan }} </span>
            <span class="ml-12 gotobalance" @click="$goto('/pages/user/balance/index')">
              去充值
            </span>
          </div>
        </u-cell>
      </u-cell-group>
    </div>
    <div class="bg-white mt-16">
      <u-cell-group>
        <u-cell
          icon="weixin-fill"
          icon-size="64rpx"
          :icon-style="{ color: '#04BE02' }"
          title="微信支付"
          :arrow="false"
          use-label-slot
          @click="changePay(0)"
        >
          <u-checkbox-group slot="value" :value="[!!(isWx && cash)]" @change="changePay(0)">
            <u-checkbox :name="true"> </u-checkbox>
          </u-checkbox-group>
          <template slot="label">
            <div class="text-gray"> 储值更优惠 </div>
          </template>
        </u-cell>
      </u-cell-group>
    </div>

    <div class="fixed pb-24 px-32" style="width:100%;bottom:0">
      <u-button type="primary" :custom-style="{ height: '72rpx', borderRadius: '0' }" @click="confirm">立即支付</u-button>
    </div>
  </div>
</template>

<script>
import { all } from '@/apis/modules/asset'
import OrderMixin from './mixin/order.js'

export default {
  mixins: [OrderMixin],
  data() {
    return {
      isWallet: false,
      isBalance: false,
      isWx: true,
      assets: [],
      orderId: null,
      amount: 0,
      onlyPoint: false, // 仅支持积分支付
    }
  },
  computed: {
    assestAmount() {
      var sum = 0
      if (this.assets && this.assets.length) {
        this.assets.forEach((element) => {
          sum += element.balance
        })
      }
      return sum
    },
    walletDiscount() {
      return this.isWallet ? Math.min(this.getAsset(23).balance, this.amount - this.balanceDiscount) : 0
    },
    balanceDiscount() {
      return this.isBalance ? Math.min(this.getAsset(21).balance, this.amount) : 0
    },
    cash() {
      return this.amount - this.walletDiscount - this.balanceDiscount
    },
  },
  onLoad(options) {
    this.orderId = options.orderId
    this.amount = options.amount
    this.onlyPoint = options.onlyPoint
  },
  async mounted() {
    this.assets = await all()
  },
  methods: {
    getAsset(type) {
      var list = this.assets.filter((c) => c.type == type)
      return (list && list[0]) || null
    },
    changePay(idx) {
      switch (idx) {
        case 0:
          if (this.walletDiscount + this.balanceDiscount >= this.amount) break
          // this.isWallet = false
          // this.isBalance = false
          this.isWx = !this.isWx
          break
        case 1:
          if (this.walletDiscount + this.balanceDiscount >= this.amount && !this.isWallet) break
          // if (this.assestAmount < this.amount) break
          this.isWallet = !this.isWallet
          // this.isWx = false
          break
        case 2:
          if (this.walletDiscount + this.balanceDiscount >= this.amount && !this.isBalance) break
          // if (this.assestAmount < this.amount) break
          this.isBalance = !this.isBalance
          // this.isWx = false
          break
        default:
          break
      }
    },
    async confirm() {
      var fullPay = (this.isWx ? this.cash : 0) + this.walletDiscount + this.balanceDiscount == this.amount
      // 金额足够？
      if (fullPay) {
        var p = []
        if (this.isWallet) {
          p.push({
            orderId: this.orderId,
            type: 23,
            amount: this.walletDiscount,
            hasPaid: true,
          })
        }
        if (this.isBalance) {
          p.push({
            orderId: this.orderId,
            type: 21,
            amount: this.balanceDiscount,
            hasPaid: true,
          })
        }
        if (this.isWx) {
          p.push({
            orderId: this.orderId,
            type: 10,
            amount: this.cash,
            hasPaid: false,
          })
        }
        await this.minpay(this.orderId, p)
      } else {
        uni.showToast({ title: '您选择的支付方式金额不足', icon: 'none' })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.gotobalance {
  text-decoration: underline;
  color: $u-primary;
}
</style>
