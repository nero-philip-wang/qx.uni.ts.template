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
        <scroll-view style="height: calc(100vh - 96rpx - 100rpx);" class="bg-white">
          <div v-for="lv2 in cata[selectedLv1].children" :key="lv2.code" class="m-16 text-black-38">
            <div class="title text-sm">{{ lv2.title }}</div>
            <div class="my-24 flex flex-wrap">
              <div
                v-for="lv3 in lv2.children"
                :key="lv3.code"
                class="flex flex-col place-items-center my-16 w-33p"
                @click="$goto('pages/item/list?catalogCode=' + lv3.code)"
              >
                <u--image :show-loading="true" :src="lv3.icon" width="80px" height="80px"></u--image>
                <div class="py-8 text-sm"> {{ lv3.title }}</div>
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <qx-tabbar value="1" />
  </div>
</template>
<script>
// import listview from '@/components/listview'
// import item from '../cart/comp/cartItem.vue'
import { catalog, item as getItem } from '@/apis/modules/home'

export default {
  // components: { item, listview },
  data() {
    return {
      selectedLv1: 0,
      cata: [],
      items: [],
      argvs: { catalogCode: 9999 },
    }
  },
  async created() {
    var list = await catalog()
    const menulv1 = list.filter((c) => c.code < 100)
    const menulv2 = list.filter((c) => c.code < 10000 && c.code > 100)
    const menulv3 = list.filter((c) => c.code > 10000)
    menulv2.forEach((element) => {
      element.children = menulv3.filter((c) => c.code < element.code * 100 + 99 && c.code > element.code * 100)
    })
    menulv1.forEach((element) => {
      element.children = menulv2.filter((c) => c.code < element.code * 100 + 99 && c.code > element.code * 100)
    })
    console.log(menulv2)
    this.cata = menulv1

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
