<template>
  <div class="page">
    <div class="bg-white px-32 pb-8 flex" style="z-index: 200;">
      <div class="left flex py-16 pr-32 align-items-center open" @click="showSelector = !showSelector">
        <u-icon name="map" size="32rpx"></u-icon>
        <span>ucoy直营</span>
        <span class="mx-8 text-gray">|</span>
        <span class="mr-8"> 先锋店</span>
        <u-icon name="arrow-down-fill" size="26rpx"></u-icon>
      </div>
      <u-search v-model="keyword" placeholder="搜索店铺" :show-action="false" @focus="showSelector = false"></u-search>
    </div>

    <div class="my-16 bg-white">
      <u-cell-group>
        <u-cell size="large" title="扬州足疗店" is-link>
          <template v-slot:label>
            <div class="text-gray text-sm">绩溪路35-5265号</div>
            <div class="text-gray text-sm">营业时间：10店-12店</div>
          </template>
          <template v-slot:right-icon>
            <div class="text-primary text-sm">当前</div>
          </template>
        </u-cell>
        <u-cell size="large" title="扬州足疗店" is-link>
          <template v-slot:label>
            <div class="text-gray text-sm">绩溪路35-5265号</div>
            <div class="text-gray text-sm">营业时间：10店-12店</div>
          </template>
          <template v-slot:right-icon>
            <div class="text-gray text-sm">上次访问</div>
          </template>
        </u-cell>
      </u-cell-group>
    </div>
    <!-- <div class="flex ml-32 mr-8 text-gray">
      <span class="flex-grow">门店列表</span>
      <span class="text-sm flex align-items-center p-8">
        <span class="text-primary"></span>
        <span class="truncate" style="float: right;width: 420rpx;">当前位置：琅琊路352-522asdasdasdas商dasdasd撒大声地</span>
        <u-icon name="map" size="32rpx" :color="cfg.primaryColor"></u-icon>
      </span>
    </div> -->
    <div class="open flex flex-wrap px-24">
      <span>门店列表</span>
      <span class="flex-grow"> </span>
      <span class="text-sm text-address truncate" style="max-width: 400rpx;">当前位置：琅琊路352-522商城4514561565615</span>
      <span class="text-sm text-primary">重新定位</span>
    </div>
    <div class="my-16 bg-white">
      <u-cell-group>
        <u-cell size="large" title="扬州足疗店" is-link>
          <template v-slot:label>
            <div class="text-gray text-sm">绩溪路35-5265号</div>
            <div class="text-gray text-sm">营业时间：10店-12店</div>
          </template>
          <template v-slot:right-icon>
            <div class="text-gray text-sm">距离526m</div>
          </template>
        </u-cell>
        <u-cell size="large" title="扬州足疗店" is-link>
          <template v-slot:label>
            <div class="text-gray text-sm">绩溪路35-5265号</div>
            <div class="text-gray text-sm">营业时间：10店-12店</div>
          </template>
          <template v-slot:right-icon>
            <div class="text-gray text-sm">距离1.2km</div>
          </template>
        </u-cell>
      </u-cell-group>
    </div>
    <page-container
      :show="showSelector"
      position="top"
      overlay-style="margin-top:42px"
      :z-index="100"
      custom-style="margin-top:42px"
      @leave="showSelector = false"
    >
      <div class="flex-grow flex">
        <scroll-view scroll-y scroll-with-animation class="cata">
          <div
            v-for="(item, i) in tenants"
            :key="item.code"
            class="text-base lv1_item"
            :class="{ active: i == selectedLv1 }"
            @click="swichMenu(item, i)"
          >
            {{ item.title }}
          </div>
        </scroll-view>

        <div class="right"> </div>
      </div>
    </page-container>
  </div>
</template>

<script>
import { tenant } from '@/apis/modules/home'
import store from '@/store'
import { tryLogin, reset } from '@/apis/modules/login'

export default {
  data() {
    return {
      tenants: [],
      noarea: null,
      showSelector: false,
      selectedLv1: 0,
    }
  },
  computed: {
    cfg() {
      return this.$cfg
    },
  },
  async created() {
    await this.getTenant()
  },
  methods: {
    async getTenant() {
      var list = await tenant()
      this.tenants = list
    },
    async change(tenant) {
      store.commit('SET_TENANT', { t: tenant.id, area: tenant.area })
      reset()
      try {
        await tryLogin()
      } catch (error) {}
      uni.reLaunch({ url: '/pages/index/index' })
    },
    async swichMenu(item, i) {
      this.selectedLv1 = i
    },
  },
}
</script>

<style lang="scss" scoped>
.open {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #464646;
}
.cata {
  width: 180rpx;
  height: 40vh;
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
