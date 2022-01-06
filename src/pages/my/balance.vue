<template>
  <div>
    <div class="card m-32 bg-primary rounded flex place-items-center text-white" style="height:200rpx">
      <div class="flex-grow pl-48">
        <div class="pb-12">可用余额</div>
        <div style="font-size:56rpx">{{ balance | yuan }}</div>
      </div>
      <div class="pr-48 py-12 text-sm underline">查看明细</div>
    </div>

    <div v-if="banner" class="mx-32 rounded overflow-hidden">
      <flow :params="banner" />
    </div>

    <div class="card m-32 mt-8 pl-32 bg-white rounded-sm">
      <div class="text-bold text-base py-32">请选择充值金额</div>
      <div class="flex flex-wrap">
        <div
          v-for="(c, idx) in acts"
          :key="idx"
          :class="{ active: current == idx }"
          class="item mr-32 mb-32 p-8 text-center rounded-sm"
          @click="current = idx"
        >
          <div class="text-xl m-16"> {{ c.amount | yuan }}元</div>
          <div class="text-sm p-8"> 赠{{ c.awardTitle }} </div>
        </div>
      </div>
      <div class="pr-32 pb-32">
        <div class="mb-16 text-sm">
          <u-checkbox-group v-model="checked">
            <u-checkbox label="我已阅读并同意《储值协议》" :name="true" label-size="24rpx" size="28rpx"> </u-checkbox>
          </u-checkbox-group>
        </div>
        <u-button plain text="确认充值" @click="confirm"></u-button>
      </div>
    </div>

    <div class="mx-32 px-8 text-gray text-sm">
      <div> 储值协议: </div>
      <u--text color="#9b9b9b" size="24rpx" :text="activity.description || ''"></u--text>
    </div>
  </div>
</template>
<script>
import { recharge } from '@/apis/modules/billing'
import { search } from '@/apis/modules/activity'
import { all } from '@/apis/modules/asset'
import flow from '../index/comp/flow.vue'

export default {
  components: { flow },
  data() {
    return {
      balance: 0,
      current: 0,
      checked: [],
      activity: null,
    }
  },
  computed: {
    banner() {
      var img = this.activity && this.activity.image
      return img
        ? {
            height: '240rpx',
            list: [{ src: this.activity && this.activity.image }],
          }
        : null
    },
    acts() {
      var acts = (this.activity && this.activity.details && this.activity.details.award) || []
      acts = acts.filter((c) => c.amount > 0)
      return acts
    },
  },
  async created() {
    // 初始化储值活动
    var acts = await search({ take: 1, type: 4, enabled: true, isValid: true })
    this.activity = acts && acts[0]

    // 获取余额
    await this.loadBalance()
  },
  methods: {
    async loadBalance() {
      var assets = await all()
      this.balance = assets && assets.filter((c) => c.type == 21).length && assets.filter((c) => c.type == 21)[0].balance
    },
    async confirm() {
      if (!this.checked.length) {
        uni.showToast({ title: '请先同意《储值协议》', icon: 'none' })
        return
      }
      if (!this.activity.id) {
        uni.showToast({ title: '当前没有储值活动', icon: 'none' })
        return
      }
      var payparams = await recharge({ amount: this.acts[this.current].amount, actId: this.activity.id })

      payparams = JSON.parse(payparams)
      wx.requestPayment({
        ...payparams,
        success: async (res) => {
          uni.showToast({ title: '支付成功' })
          await this.loadBalance()
          setTimeout(() => {
            this.$emit('update')
          }, 800)
        },
        fail: (res) => {
          uni.showToast({ title: '支付失败' })
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  max-width: 50%;
  min-width: 30%;
  border: 2px solid #e8e8e8;
  width: 295rpx;

  .text-sm {
    border-top: 2px solid #e8e8e8;
    color: #9b9b9b;
  }
}

.item.active {
  background: rgba(227, 14, 21, 0.04);
  border: 2px solid #e30e15;
  color: #e30e15;
  .text-sm {
    border-top: 2px solid #e30e15;
    color: #e30e15;
  }
}
</style>
