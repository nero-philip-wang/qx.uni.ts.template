<template>
  <div class="h-page flex-col">
    <div class="px-16 py-16">
      <u-search placeholder="请输入关键字" :show-action="false" bg-color="#fff" disabled @click="$goto('pages/item/search')"></u-search>
    </div>
    <div class="flex-grow flex">
      <scroll-view scroll-y scroll-with-animation class="cata">
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

      <div class="right">
        <listview v-model="items" loadmore-enabled :argvs="argvs" height="calc(100vh - 96rpx - 100rpx)" :request="getItem" manual>
          <div v-for="c in items" :key="c.id" class="bg-white rounded-sm overflow-hidden mb-16 mx-12">
            <item is-item :value="c" small></item>
          </div>
        </listview>
      </div>
    </div>
    <qx-tabbar value="1" />
  </div>
</template>
<script>
import listview from '@/components/listview'
import item from '../cart/comp/cartItem.vue'
import { catalog, item as getItem } from '@/apis/modules/home'

export default {
  components: { item, listview },
  data() {
    return {
      selectedLv1: 0,
      cata: [],
      items: [],
      argvs: { catalogCode: 9999 },
    }
  },
  async created() {
    this.cata = await catalog()
    this.argvs.catalogCode = this.cata && this.cata[0] && this.cata[0].code
  },
  methods: {
    getItem,
    async swichMenu(item, idx) {
      if (idx == this.selectedLv1) return
      this.selectedLv1 = idx
      this.argvs.catalogCode = item.code
    },
  },
}
</script>
<style scoped lang="scss">
.cata {
  width: 180rpx;
  height: calc(100vh - 96rpx - 100rpx);
  background: #f8f8f7;
}
.right {
  width: 570rpx;
}
.lv1_item {
  height: 100rpx;
  line-height: 28rpx;
  color: #1b1b1b;
  text-align: center;
  padding: 36rpx 0;
  border-left: #f5f5f5 solid 8rpx;
  color: #969799;
}
.lv1_item.active {
  border-left: $u-primary-dark solid 8rpx;
  background: #ffffff;
  color: #1b1b1b;
}
</style>
