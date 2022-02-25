<template>
  <div class="">
    <div class="card mt-32 mx-32 bg-primary rounded flex place-items-center text-white bottom_no_rounder" style="height:200rpx;">
      <div class="flex-grow pl-48">
        <div class="pb-12">余额</div>
        <div style="font-size:56rpx">{{ balance | yuan }}</div>
      </div>
      <div class="pr-48 py-12">
        <u-button shape="circle" text="提 现" :custom-style="{ padding: '16rpx 40rpx', height: 'inherit' }"></u-button>
      </div>
    </div>

    <div class="bg-white">
      <u-tabs :list="tabs" :scrollable="false" @change="(item) => (argvs.direction = item.value)"></u-tabs>
      <listview v-model="list" height="calc(100vh - 232rpx - 88rpx)" loadmore-enabled :argvs="argvs" :request="getrecord">
        <div v-for="c in list" :key="c.id" class="item flex place-items-center ml-32">
          <u-avatar v-if="c.direction" bg-color="#FFF7E6" color="#FFC069" icon="red-packet-fill" size="56rpx"></u-avatar>
          <u-avatar v-else icon="bag-fill" bg-color="#EDFAE0" color="#95DD64" size="56rpx"></u-avatar>
          <div class="ml-40 flex-grow">
            <div class="text-base">{{ c.remark }}</div>
            <div class="text-sm text-gray">{{ c.creationTime | timef }}</div>
          </div>
          <div class="text-right mr-32">
            <div class="text-base">{{ c.value > 0 ? '+' : '' }}{{ c.value | yuan }}</div>
            <div class="text-sm text-gray">余额 {{ c.balance | yuan }}</div>
          </div>
        </div>
      </listview>
    </div>
  </div>
</template>
<script>
import { all, getrecord } from '@/apis/modules/asset'
import listview from '@/components/listview'
const type = 23

export default {
  components: { listview },
  filters: {
    statustext: (code) => {
      switch (code.status) {
        case 0:
          return code.direction ? (code.type == 1 ? '预计收益' : '待支付') : '待审核'
        case 1:
          return '已审核'
        case 2:
          return '已到账'
        case 3:
          return '已取消'
      }
    },
  },
  data() {
    return {
      tabs: [
        { name: '全部', value: null },
        { name: '已获取', value: 1 },
        { name: '已消耗', value: 0 },
      ],
      balance: 0,
      list: [],
      argvs: { type, direction: null },
    }
  },
  async created() {
    // 获取余额
    await this.loadBalance()
  },
  methods: {
    getrecord,
    async loadBalance() {
      var assets = await all()
      this.balance = assets && assets.filter((c) => c.type == type).length && assets.filter((c) => c.type == type)[0].balance
    },
  },
}
</script>

<style lang="scss" scoped>
.bottom_no_rounder {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.item {
  height: 132rpx;
  border-bottom: 1px solid #e8e8e8;
}
</style>
