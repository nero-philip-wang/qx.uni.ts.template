<template>
  <div class="app">
    <div v-if="list.length === 0" class="m-32">
      <u-empty mode="address"></u-empty>
    </div>
    <div v-else>
      <div v-for="(item, index) in list" :key="index" class="rounded bg-white m-20 px-32 pt-32 text-base" @click="onSelect(item)">
        <div class="row">
          <span class="mr-28">{{ item.name }}</span>
          <span class="text-gray">{{ item.mobile }}</span>
          <span v-if="item.is_default" class="tag">默认</span>
        </div>
        <div class="text-gray address my-16">
          <span> {{ item.address }} </span>
          <span v-if="item.room" class="ml-4"> @{{ item.room }} </span>
        </div>
        <div class="bt-1 flex-re" @click.stop.prevent>
          <div class="p-16" @click="showDelModal(index)">
            删除
          </div>
          <div class="p-16" @click="edit(item)">
            编辑
          </div>
        </div>
      </div>
    </div>

    <div class="fixed">
      <u-button type="primary" shape="circle" @click="$goto('/pages/consignee/detail')">
        新增收货地址
      </u-button>
    </div>
  </div>
</template>

<script>
import { search, del } from '@/apis/modules/consignee'
// import { setConsignee } from '@/apis/modules/billing'

export default {
  data() {
    return {
      list: [],
      loaded: false,
      showDeleteAddr: false,
      isChooseMode: false,
    }
  },
  onLoad(options) {
    this.isChooseMode = !!options.choose
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const res = await search()
      this.list = res || []
      this.loaded = true
    },
    // 选择地址
    onSelect(item) {
      if (this.isChooseMode) {
        // setConsignee(item)
        this.$goto(-1)
      } else {
        this.edit(item)
      }
    },
    // 编辑地址
    edit(item) {
      this.$goto('/pages/consignee/detail?id=' + item.id)
    },
    showDelModal(index) {
      uni.showModal({
        title: '删除',
        content: '确定要删除该地址吗',
        success: async (res) => {
          if (res.confirm) {
            await del(this.list[index].id)
            this.list.splice(index, 1)
          } else if (res.cancel) {
          }
        },
      })
    },
  },
}
</script>
<style scoped>
.address {
  min-height: 72rpx;
}
.fixed {
  bottom: 50rpx;
  left: 100rpx;
  right: 100rpx;
}
</style>
