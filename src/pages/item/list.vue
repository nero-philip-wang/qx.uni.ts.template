<template>
  <div class="flex flex-col h-page">
    <div class="bg-white py-16 px-48">
      <u-search v-model="argvs.keywords" :show-action="false" disabled placeholder="请输入搜索关键字" @click="$goto('-1')"></u-search>
    </div>
    <listview
      v-if="list.length || loading"
      v-model="list"
      loadmore-enabled
      :argvs="argvs"
      height="100%"
      :request="getItem"
      class="flex-grow mt-16"
    >
      <item v-for="c in list" :key="c.id" small is-item :value="c"></item>
    </listview>
    <u-empty v-else mode="search" />
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
      loading: true,
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
