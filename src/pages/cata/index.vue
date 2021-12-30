<template>
  <div class="h-page flex-col">
    <div class="px-16 py-16">
      <u-search placeholder="请输入关键字" :show-action="false" bg-color="#fff" disabled></u-search>
    </div>
    <div class="flex-grow flex overflow-hidden">
      <scroll-view scroll-y scroll-with-animation style="width:180rpx">
        <div
          v-for="(item, i) in cata"
          :key="item.code"
          class="text-base lv1_item"
          :class="{ active: i == selectedLv1 }"
          @click="swichMenu(item, i)"
        >
          {{ item.title }}
        </div>
      </scroll-view>
      <scroll-view
        scroll-y
        scroll-with-animation
        class="h-full bg-white"
        style="width:570rpx"
        @scrolltolower="loadItems(cata[selectedLv1].code, true)"
      >
        <item v-for="c in items" :key="c.id" small is-item :value="c"></item>
      </scroll-view>
    </div>
    <qx-tabbar value="1" />
  </div>
</template>
<script>
import item from '../cart/comp/cartItem.vue'
import { catalog, item as getItem } from '@/apis/modules/home'

export default {
  components: { item },
  data() {
    return {
      selectedLv1: 0,
      cata: [],
      items: [],
      paging: {
        take: 7,
        skip: 0,
        hasNext: true,
      },
    }
  },
  async created() {
    this.cata = await catalog()
    await this.loadItems(this.cata && this.cata[0] && this.cata[0].code)
  },
  methods: {
    async swichMenu(item, idx) {
      if (idx == this.selectedLv1) return
      this.selectedLv1 = idx
      await this.loadItems(item.code)
    },
    async loadItems(code, keepCurrent) {
      if (!keepCurrent) {
        this.paging = { take: 7, skip: 0, hasNext: true }
        this.items = await getItem({ catalogCode: code, ...this.paging })
        if (this.items.length < this.paging.take) this.paging.hasNext = false
      } else if (this.paging.hasNext) {
        this.paging.skip += this.paging.take
        var list = await getItem({ catalogCode: code, ...this.paging })
        if (list.length < this.paging.take) this.paging.hasNext = false
        this.items = [...this.items, ...list]
      }
    },
  },
}
</script>
<style scoped>
.h-page {
  /* background: #f8f8f7; */
}
.lv1_item {
  height: 100rpx;
  line-height: 28rpx;
  color: #1b1b1b;
  text-align: center;
  padding: 36rpx 0;
  border-left: #f5f5f5 solid 8rpx;
  background: #f8f8f7;
  color: #969799;
}
.lv1_item.active {
  border-left: #b50006 solid 8rpx;
  background: #ffffff;
  color: #1b1b1b;
}
</style>
