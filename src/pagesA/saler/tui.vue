<template>
  <div class="bg-white px-32">
    <listview v-model="list" height="100vh" loadmore-enabled :argvs="argvs" :request="distributer">
      <div v-for="c in list" :key="c" class="flex place-items-center mb-32">
        <image :src="c.avatar" class="mr-8 rounded-full" style="width:100rpx;height:100rpx;"></image>
        <div class="flex-grow text-base ml-16">
          <div class="ml-8">{{ c.name }}</div>
          <div>{{ c.mobile }}</div>
        </div>
        <u-tag :text="c.rule.title" plain size="mini" shape="circle" type="success"></u-tag>
      </div>
    </listview>
  </div>
</template>

<script>
import { distributer } from '@/apis/modules/distribution'
import listview from '@/components/listview'

export default {
  components: { listview },
  data() {
    return {
      argvs: {},
      distributer,
      list: [],
    }
  },
}
</script>

<style></style>
