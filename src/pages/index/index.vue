<template>
  <div>
    <u-navbar safe-area-inset-top placeholder fixed bg-color="#F2F3F7">
      <div slot="left" class="pl-8 py-16 flex text-sm">
        <span class="icon-c mr-16" @click="$goto('pages/index/shop')"> &#xe60c; {{ tTitle }}</span>
        <u-search
          :placeholder="`在${shopTitle}中搜索`"
          :show-action="false"
          bg-color="#f8f8f8"
          disabled
          @click="$goto('pages/item/search')"
        ></u-search>
      </div>
    </u-navbar>

    <div v-if="page.length">
      <div
        v-for="(p, idx) in page"
        :key="idx"
        :class="p.name == 'flow' || p.name == 'banner' || p.name == 'horizontalList' ? 'mx-24 mb-32' : 'mx-24 mb-32 bg-white rounded'"
      >
        <banner v-if="p.name == 'banner'" :params="p" />
        <diamond v-if="p.name == 'diamond'" :params="p" />
        <horizontalList v-if="p.name == 'horizontalList'" :params="p" />
        <flow v-if="p.name == 'flow'" :params="p" />
        <fixed v-if="p.name == 'fixed'" :params="p" />
      </div>
    </div>
    <div v-else class="m-24 p-16 bg-white rounded">
      <u-skeleton rows="4" loading rows-height="220rpx" :rows-width="['100%', '100%', '100%', '100%']" :title="false"></u-skeleton>
    </div>

    <!-- 新人礼 -->
    <u-popup mode="center" :custom-style="{ lineHeight: 0, width: '70%' }" :show="hasAward" closeable @close="hasAward = false">
      <image
        style="width: 100%"
        :src="hasAward.image"
        mode="widthFix"
        @click="
          $goto('pages/login/login')
          hasAward = false
        "
      />
    </u-popup>

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
import { page, getPoster, hasNewAward } from '@/apis/modules/home'
import shareLite from '@/utils/appLaunch/share'

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
      hasAward: null,
    }
  },
  computed: {
    tTitle() {
      return store.state.share.tenant
    },
    shopTitle() {
      return store.state.share.shop
    },
  },
  async mounted() {
    var res = await page()
    this.page = res && res.content && JSON.parse(res.content)
    setTimeout(async () => {
      var posters = await getPoster()
      // uni.$u.liteShare.page = '/pages/index/index'
      if (posters.indexShare) uni.$u.liteShare.image = posters.indexShare

      if (!store.getters.isLogged) {
        const award = await hasNewAward()
        this.hasAward = award && award[0]
      }
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
