<template>
  <div class="h-page flex-col">
    <div class="card mt-32 mx-32 bg-primary rounded flex place-items-center text-white bottom_no_rounder" style="height:200rpx;">
      <div class="flex-grow pl-48">
        <div class="pb-12">可用余额</div>
        <div style="font-size:56rpx">2000.00</div>
      </div>
      <div class="pr-48 py-12">
        <u-button shape="circle" text=" 提 现 " size="mini"></u-button>
      </div>
    </div>

    <div class="bg-white flex-grow">
      <u-tabs :list="list1" line-color="#e30e15"></u-tabs>
      <div>
        <div v-for="i in 10" :key="i" class="item flex place-items-center ml-32">
          <u-icon name="photo" size="56rpx"></u-icon>
          <div class="ml-40 flex-grow">
            <div class="text-base">消费获取</div>
            <div class="text-sm text-gray">2022-02-02 12:00:00</div>
          </div>
          <div class="text-right mr-32">
            <div class="text-base">+100</div>
            <div class="text-sm text-gray">余额 853.32</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list1: [
        {
          name: '全部',
        },
        {
          name: '已获取',
        },
        {
          name: '已消耗',
        },
      ],
    }
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
