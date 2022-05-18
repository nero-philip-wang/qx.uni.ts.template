<template>
  <div>
    <u-navbar safe-area-inset-top placeholder fixed bg-color="#F2F3F7">
      <div slot="left" class="pl-8 py-16 flex text-sm">
        <span class="icon-c mr-16" @click="$goto('pages/index/tenant')"> &#xe60c; {{ tTitle }}</span>
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
        <fixed v-if="p.name == 'fixed'" :params="p" />
      </div>
    </div>
    <div v-else class="m-24 p-16 bg-white rounded">
      <u-skeleton rows="15" title loading></u-skeleton>
    </div>
    <qx-tabbar />
  </div>
</template>
<script>
import banner from './comp/banner.vue'
import diamond from './comp/diamond.vue'
import horizontalList from './comp/horizontalList.vue'
import flow from './comp/flow.vue'
import fixed from './comp/fixed.vue'
import { section } from './comp/meta'
import store from '@/store/'
import { page, getPoster } from '@/apis/modules/home'
import shareLite from '@/utils/share/lite'

export default {
  components: {
    banner,
    diamond,
    horizontalList,
    flow,
    fixed,
  },
  mixins: [shareLite],
  data() {
    return {
      page: [],
      list: section(),
    }
  },
  computed: {
    tTitle() {
      return store.state.user.tTitle
    },
  },
  async mounted() {
    var res = await page()
    this.page = res && res.content && JSON.parse(res.content)
    setTimeout(async () => {
      var posters = await getPoster()
      uni.$u.liteShare.page = '/pages/index/index'
      if (posters.indexShare) uni.$u.liteShare.image = posters.indexShare
    }, 600)
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
