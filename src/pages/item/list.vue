<template>
  <div>
    <div class="bg-white py-16 px-48 mb-24">
      <u-search v-model="argvs.keywords" :show-action="false" disabled placeholder="请输入搜索关键字" @click="$goto(-1)"></u-search>
    </div>
    <listview
      v-model="list"
      loadmore-enabled
      :argvs="argvs"
      height="calc(100vh - 64rpx - 32rpx - 24rpx)"
      :request="getItem"
      class="flex-grow mt-16"
    >
      <div v-for="c in list" :key="c.id" class="bg-white rounded-sm overflow-hidden my-16 mx-12">
        <item is-item :value="c"></item>
      </div>
    </listview>
  </div>
</template>

<script>
import listview from '@/components/listview'
import item from '../cart/comp/cartItem.vue'
import { item as getItem } from '@/apis/modules/home'

export default {
  components: { listview, item },
  data() {
    return {
      list: [],
      argvs: {
        keywords: '',
      },
    }
  },
  onLoad(options) {
    this.argvs.keywords = decodeURIComponent(options.keyword)
  },
  methods: {
    getItem,
  },
}
</script>
