<template>
  <div class="app column">
    <div class="search-wrap">
      <u-search v-model="keyword" placeholder="请输入搜索关键字" @search="search" @custom="search"></u-search>
    </div>

    <div class="content">
      <div v-if="historyList.length > 0" class="s-header row">
        <span class="tit">历史搜索</span>
        <span class="mix-icon icon-lajitong" @click="showPopup('mixModal')"></span>
      </div>
      <div v-if="historyList.length > 0" class="list" style="margin-bottom: 20rpx;">
        <div v-for="(item, index) in historyList" :key="index" class="item center" @click="search(item)">
          <span>{{ item }}</span>
        </div>
      </div>
      <div v-if="hotList.length > 0" class="s-header row">
        <span class="tit">热门搜索</span>
      </div>
      <div v-if="hotList.length > 0" class="list">
        <div v-for="(item, index) in hotList" :key="index" class="item center" @click="search(item.name)">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <mix-modal ref="mixModal" span="您确定要清除搜索历史吗" @onConfirm="delHistory"></mix-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      hotList: [],
      historyList: [],
    }
  },
  onLoad(options) {
    this.sourcePage = options.sourcePage
    this.loadHotKeywords()
    this.loadHistory()
  },
  methods: {
    // 加载热搜关键词
    async loadHotKeywords() {
      const response = await this.$request('search', 'get')
      this.hotList = response.data
    },
    // 加载历史搜索
    loadHistory() {
      uni.getStorage({
        key: 'keywordHistoryList',
        success: (res) => {
          this.historyList = res.data || []
        },
      })
    },
    // 执行搜索
    search(keyword) {
      if (typeof keyword !== 'string') {
        keyword = this.keyword
      } else {
        keyword = keyword.trim()
        this.keyword = keyword
      }
      if (!keyword) {
        this.$util.msg('请输入搜索关键字')
        return
      }
      this.saveKeyword() // 保存为历史

      this.$goto('/pages/list/result?keywords=' + keyword)
      //   this.$request('search', 'update', {
      //     keyword,
      //   })

      //   if (this.sourcePage === 'productList') {
      //     this.$util.prePage().keyword = keyword
      //     this.$util.prePage().refreshList()
      //     uni.navigateBack()
      //   } else {
      //     this.navTo(`/pages/product/list?keyword=${keyword}&sourcePage=search`)
      //   }
    },
    // 保存关键字到历史记录
    saveKeyword() {
      let list = uni.getStorageSync('keywordHistoryList')
      if (!list) {
        list = []
      }
      const index = list.findIndex((item) => item === this.keyword)
      if (index > -1) {
        list.splice(index, 1)
      }
      list.unshift(this.keyword)
      // 只保存30条记录
      if (list.length > 30) {
        list.length = 30
      }
      this.historyList = list
      uni.setStorage({
        key: 'keywordHistoryList',
        data: list,
      })
    },
    // 清除历史搜索
    delHistory() {
      this.historyList = []
      uni.removeStorage({
        key: 'keywordHistoryList',
      })
    },
    // 清空输入框
    clearInput() {
      this.keyword = ''
    },
  },
}
</script>

<style scoped lang="scss">
.app {
  background: #fff;
}
.search-wrap {
  padding-left: 50rpx;
  padding-right: 50rpx;
  height: 100rpx;

  .icon-sousuo {
    padding: 0 12rpx 0 20rpx;
    font-size: 40rpx;
    color: #999;
  }
  .input-box {
    width: 604rpx;
    height: 80rpx;
    border-radius: 100rpx;
    background: #f5f6f7;
  }
  .input {
    flex: 1;
    font-size: 30rpx;
    color: #333;
  }
  .icon-guanbi2 {
    padding: 10rpx 20rpx;
    font-size: 32rpx;
    color: #999;
  }
  .search-btn {
    flex-shrink: 0;
    padding: 0 24rpx 0 20rpx;
    font-size: 32rpx;
    color: #007aff;
  }
}
.content {
  flex: 1;
  padding-top: 24rpx;
  border-radius: 28rpx 28rpx 0 0;
  background-color: #fff;
}
.s-header {
  height: 80rpx;
  padding: 0 32rpx 0 40rpx;

  .tit {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    font-weight: 700;
  }
  .icon-lajitong {
    padding: 10rpx;
    font-size: 36rpx;
    color: #333;
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx 0 0 36rpx;

  .item {
    min-width: 60rpx;
    height: 58rpx;
    padding: 0 24rpx;
    margin: 0 24rpx 24rpx 0;
    border-radius: 100rpx;
    background-color: #f5f6f7;
    font-size: 26rpx;
    color: #666;
  }
}
</style>
