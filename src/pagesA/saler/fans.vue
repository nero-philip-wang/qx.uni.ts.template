<template>
  <div class="bg-white px-32">
    <listview v-model="list" height="100vh" loadmore-enabled :argvs="argvs" :request="member">
      <div v-for="c in list" :key="c" class="flex place-items-center mb-32">
        <image :src="c.avatar" class="mr-8 rounded-full" style="width:100rpx;height:100rpx;"></image>
        <div class="flex-grow text-base ml-16">
          <div class="ml-8">{{ c.nickname }}</div>
          <div>{{ c.mobile }}</div>
        </div>
        <div class="pr-8 text-sm"> {{ c.creationTime | datef }} 加入 </div>
        <u-tag v-if="c.firstTradeTime" text="已消费" plain size="mini" shape="circle" type="success"></u-tag>
        <u-tag v-else text="未消费" plain size="mini" shape="circle" type="info"></u-tag>
      </div>
    </listview>
  </div>
</template>

<script>
import { member } from '@/apis/modules/distribution'
import listview from '@/components/listview'

export default {
  components: { listview },
  data() {
    return {
      argvs: {},
      member,
      list: [],
    }
  },
}
</script>

<style></style>
