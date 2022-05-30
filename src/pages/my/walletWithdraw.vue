<template>
  <div class="flex flex-col h-page">
    <div class="py-60 px-48">
      <u-form-item label="到账账户" label-width="200rpx">
        <u--input v-model="account" placeholder="请输入支付宝账户" border="none"></u--input>
      </u-form-item>
    </div>
    <div class="flex-grow relative bg-white rounded p-48">
      <div class="text-sm">提现金额</div>
      <div class="flex bb-1 text-xxl mb-24">
        <span class="rmb">￥</span>
        <span class="scoped1">
          <u--input
            v-model.number="amount"
            type="digit"
            border="none"
            font-size="64rpx"
            focus
            :disabled="max < 1000"
            :placeholder="max < 1000 ? '低于10元不可提现' : ''"
            @input="check"
          >
          </u--input>
        </span>
      </div>
      <div class="text-sm text-gray mb-24">返利余额￥{{ max | yuan }}</div>

      <div class="text-sm text-gray">
        <div>提现说明：</div>
        <div post>
          1: 满10元即可提现，提现最小单位为元 <br />
          2: 每月可发起两次提现申请，建议每月的14号和29号发起一次提现申请 <br />
          3: 每月的15号，30号两天处理之前的提现申请 <br />
        </div>
      </div>

      <div class="absolute">
        <u-button text="确定" type="primary" size="large" @click="confirm"></u-button>
      </div>
    </div>
  </div>
</template>

<script>
import { cashout } from '@/apis/modules/asset'
import store from '@/store/index'

export default {
  data() {
    return {
      amount: '',
      max: 0,
      account: null,
    }
  },
  computed: {
    amountFen: {
      get() {
        return parseInt(this.amount * 100)
      },
      set(v) {
        this.amount = (v / 100).toFixed(2)
      },
    },
  },
  onLoad(options) {
    if (options.max) this.max = options.max
    this.account = store.state.user.account
  },
  methods: {
    async confirm() {
      if (!this.amountFen || this.amountFen <= 0) {
        uni.showToast({ title: '请输入提现金额', icon: 'none' })
      } else if (!this.account || this.account.length < 5) {
        uni.showToast({ title: '请输入提现账户', icon: 'none' })
      } else {
        store.commit('SET_WWACCOUNT', this.account)
        await cashout({ amount: this.amountFen, account: this.account })
        uni.showToast({ title: '申请提现成功，请耐心等待后台人员审核', icon: 'none' })
        setTimeout(() => {
          this.$goto(-1)
        }, 200)
      }
    },
    check(e) {
      this.$nextTick(() => {
        this.amount = parseInt(e)
        var y = this.amount - 0
        if (y * 100 > this.max) this.amount = parseInt(this.max / 100)
      })
    },
  },
}
</script>

<style lang="scss">
.scoped1 .u-input input,
.rmb {
  line-height: 100rpx !important;
  height: 100rpx !important;
}

.absolute {
  bottom: 80rpx;
  right: 48rpx;
}
</style>
