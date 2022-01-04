<template>
  <div class="bg-white pb-32">
    <div class="py-32 px-64">
      <u-search v-model="keyword" focus clearabled placeholder="请输入搜索关键字" @search="search" @custom="search"></u-search>
    </div>

    <div class="px-64">
      <!-- 历史搜索 -->
      <div v-if="historyList.length > 0" class="flex">
        <span class="flex-grow text-base text-bold">历史搜索</span>
        <span class="p-12" @click="delHistory">
          <u-icon name="trash" size="28rpx"></u-icon>
        </span>
      </div>
      <div v-if="historyList.length > 0" class="flex flex-wrap mb-8">
        <div v-for="(item, index) in historyList" :key="index" class="mr-12 mt-16">
          <u-tag :text="item" plain shape="circle" type="info" @click="search(item)"></u-tag>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div v-if="hotList.length > 0" class="flex">
        <span class="text-base text-bold">热门搜索</span>
      </div>
      <div v-if="hotList.length > 0" class="flex flex-wrap mb-8">
        <div v-for="(item, index) in hotList" :key="index" class="mr-12 mt-16">
          <u-tag :text="item" plain shape="circle" type="info" @click="search(item)"></u-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/index'

export default {
  data() {
    return {
      keyword: '',
      hotList: [],
    }
  },
  computed: {
    historyList: () => store.state.searchHistory,
  },
  onLoad(options) {
    this.sourcePage = options.sourcePage
    this.loadHotKeywords()
  },
  methods: {
    // 加载热搜关键词
    async loadHotKeywords() {},
    // 执行搜索
    search(keyword) {
      if (typeof keyword !== 'string') {
        keyword = this.keyword
      } else {
        keyword = keyword.trim()
        this.keyword = keyword
      }
      if (!keyword) {
        uni.showToast({ title: '请输入搜索关键字', icon: 'error' })
        return
      }
      store.commit('SET_HISTORY', this.keyword) // 保存关键字到历史记录

      this.$goto('/pages/item/list?keyword=' + keyword)
    },
    // 清除历史搜索
    delHistory() {
      uni.showModal({
        title: '您确定要清除搜索历史吗',
        content: '',
        success: (result) => {
          if (result.confirm) store.commit('RESET_HISTORY')
        },
      })
    },
  },
}
</script>
