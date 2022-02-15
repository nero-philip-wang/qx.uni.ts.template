<template>
  <div class="h-page p-32">
    <listview v-model="ratingData" loadmore-enabled :request="search" :argvs="argvs" height="100%" manual>
      <rating-item v-for="item in ratingData" :key="item.orderId" :data="item"></rating-item>
    </listview>
    <!-- <u-empty v-if="!ratingData || ratingData.length < 1" text="暂无评价" mode="history"></u-empty> -->
  </div>
</template>

<script>
import { getRating } from '@/apis/modules/item'
import ratingItem from './comp/comment.vue' // 底部栏
import listview from '@/components/listview'

export default {
  components: {
    ratingItem,
    listview,
  },
  data() {
    return {
      ratingData: [],
      argvs: {},
    }
  },
  async onLoad(options) {
    this.argvs = { id: options.id }
  },
  methods: {
    async search(argvs) {
      return await getRating(argvs.id, argvs.skip, argvs.take)
    },
  },
}
</script>
