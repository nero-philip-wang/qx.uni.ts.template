<template>
  <div>
    <u-navbar safe-area-inset-top placeholder fixed bg-color="#F2F3F7">
      <div slot="left" class="pl-8 py-16 flex text-sm">
        <span class="icon-c mr-16" @click="$goto('pages/index/tenant')"> &#xe6ac; {{ tTitle }}</span>
        <u-search
          placeholder="请输入关键字"
          :show-action="false"
          bg-color="#f8f8f8"
          disabled
          @click="$goto('pages/item/search')"
        ></u-search>
      </div>
    </u-navbar>

    <div v-if="page.length">
      <div v-for="(p, idx) in page" :key="idx" :class="p.name == 'flow' ? 'm-24' : 'm-24 bg-white rounded'">
        <banner v-if="p.name == 'banner'" :params="p" />
        <diamond v-if="p.name == 'diamond'" :params="p" />
        <horizontalList v-if="p.name == 'horizontalList'" :params="p" />
        <flow v-if="p.name == 'flow'" :params="p" />
      </div>
    </div>
    <div v-else class="m-24 p-16 bg-white rounded">
      <u-skeleton rows="15" title loading></u-skeleton>
    </div>
    <!-- 
    <u-tabs
      scrollable
      :list="[
        {
          name: '关注阿萨',
        },
        {
          name: '推阿萨荐',
        },
        {
          name: '电阿萨影',
        },
        {
          name: '科阿萨技',
        },
        {
          name: '音乐阿萨',
        },
        {
          name: '美食阿萨',
        },
        {
          name: '文化阿萨',
        },
        {
          name: '财经阿萨',
        },
        {
          name: '手工阿萨',
        },
      ]"
    ></u-tabs>
    <scroll-view scroll-y scroll-with-animation>
      <div v-for="i in 8" :key="i" class="m-24 bg-white rounded">
        <item small is-item>{{ i }}</item>
      </div>
    </scroll-view> -->

    <qx-tabbar />
  </div>
</template>
<script>
import banner from './comp/banner.vue'
import diamond from './comp/diamond.vue'
import horizontalList from './comp/horizontalList.vue'
import flow from './comp/flow.vue'
import { section } from './comp/meta'
import item from '../cart/comp/cartItem.vue'
import store from '@/store/'
import { page } from '@/apis/modules/home'

var p2 = section()
p2.list.push(...p2.list)
p2.height = '120rpx'

export default {
  components: {
    banner,
    diamond,
    horizontalList,
    flow,
    item,
  },
  data() {
    return {
      // p: { ...section(), height: '320rpx' },
      // p2,
      page: [],
    }
  },
  computed: {
    tTitle() {
      return store.state.user.tTitle
    },
  },
  async mounted() {
    var res = await page()
    this.page = res.content && JSON.parse(res.content)
  },
  beforeCreate() {
    uni.hideTabBar()
  },
  methods: {},
}
</script>
<style scoped>
.icon-c {
  line-height: 64rpx;
}
</style>
