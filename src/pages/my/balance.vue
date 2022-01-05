<template>
  <div>
    <div class="card m-32 bg-primary rounded flex place-items-center text-white" style="height:200rpx">
      <div class="flex-grow pl-48">
        <div class="pb-12">可用余额</div>
        <div style="font-size:56rpx">2000.00</div>
      </div>
      <div class="pr-48 py-12 text-sm underline">查看明细</div>
    </div>

    <div class="mx-32 rounded overflow-hidden">
      <flow :params="list1" />
    </div>

    <div class="card m-32 mt-8 pl-32 bg-white rounded-sm">
      <div class="text-bold text-base py-32">请选择充值金额</div>
      <div class="flex flex-wrap">
        <div v-for="i in 4" :key="i" :class="{ active: current == i }" class="item mr-32 mb-32 p-8 text-center rounded-sm">
          <div class="text-xl m-16"> 100元</div>
          <div class="text-sm p-8"> 争 保洁券一张</div>
        </div>
      </div>
      <div class="pr-32 pb-32">
        <div class="mb-16 text-sm">
          <u-checkbox-group v-model="checked">
            <u-checkbox label="我已阅读并同意《储值协议》" :name="true" label-size="24rpx" size="28rpx"> </u-checkbox>
          </u-checkbox-group>
        </div>
        <u-button plain text="确认充值"></u-button>
      </div>
    </div>

    <div class="mx-32 px-8 text-gray text-sm">
      <div> 储值协议: </div>
      <u--text color="#9b9b9b" size="24rpx" :text="tips"></u--text>
    </div>
  </div>
</template>
<script>
import flow from '../index/comp/flow.vue'
import { section } from '../index/comp/meta'
var list1 = section()
list1.title = null
list1.list.length = 1
list1.list[0].title = null

export default {
  components: { flow },
  data() {
    return {
      current: 0,
      list1,
      tips: 'sakldmlksandjksnlsmdjsaknjk \n sakldmlksandjksnlsmdjsaknjk \n sakldmlksandjksnlsmdjsaknjk \n',
      checked: [],
    }
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
