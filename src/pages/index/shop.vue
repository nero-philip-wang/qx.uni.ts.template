<template>
  <div class="page">
    <div class="bg-white px-32 pb-8 flex" style="z-index: 200;">
      <div class="left flex py-16 pr-32 align-items-center open" @click="showSelector = !showSelector">
        <u-icon name="map" size="32rpx"></u-icon>
        <span class="mx-8">{{ shop }}</span>
        <!-- <span class="mx-8 text-gray">|</span> -->
        <!-- <span class="mr-8"> 先锋店</span> -->
        <u-icon name="arrow-down-fill" size="26rpx"></u-icon>
      </div>
      <u-search v-model="keyword" placeholder="搜索店铺" :show-action="false" @focus="showSelector = false"></u-search>
    </div>

    <div class="my-16 bg-white">
      <u-cell-group>
        <u-cell size="large" :title="currentShop.shopTitle" is-link>
          <!-- <template v-slot:label>
            <div class="text-gray text-sm">绩溪路35-5265号</div>
            <div class="text-gray text-sm">营业时间：10店-12店</div>
          </template> -->
          <template v-slot:right-icon>
            <div class="text-primary text-sm">当前</div>
          </template>
        </u-cell>
        <!-- <u-cell size="large" title="扬州足疗店" is-link>
          <template v-slot:label>
            <div class="text-gray text-sm">绩溪路35-5265号</div>
            <div class="text-gray text-sm">营业时间：10店-12店</div>
          </template>
          <template v-slot:right-icon>
            <div class="text-gray text-sm">上次访问</div>
          </template>
        </u-cell> -->
      </u-cell-group>
    </div>

    <div class="open flex flex-wrap px-24">
      <span>门店列表</span>
      <span class="flex-grow"> </span>
      <!-- <span class="text-sm text-address truncate" style="max-width: 400rpx;">当前位置：琅琊路352-522商城4514561565615</span> -->
      <!-- <span class="text-sm text-primary">重新定位</span> -->
    </div>
    <div class="my-16 bg-white">
      <u-cell-group>
        <u-cell v-for="item in storeList" :key="item.id" size="large" :title="item.title" is-link @click="change(item)">
          <template v-slot:label>
            <div class="text-gray text-sm">{{ item.consignee.address }}</div>
            <div class="text-gray text-sm">营业时间：{{ item.workHour }}</div>
          </template>
          <template v-slot:right-icon>
            <div class="text-gray text-sm">距离526m</div>
          </template>
        </u-cell>
      </u-cell-group>
    </div>
    <!-- 选择商户 -->
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
            :class="{ active: item.id == selectedLv1.id }"
            @click="swichMenu(item, i)"
          >
            {{ item.title }}
          </div>
        </scroll-view>

        <div class="right">
          <div v-for="(item, i) in cityList" :key="item.code" class="ml-12 p-24 text-base text-black-38 bb-1" @click="swichCity(item, i)">
            {{ item.title }}
          </div>
        </div>
      </div>
    </page-container>
  </div>
</template>

<script>
import { tenant, getCities, getStores } from '@/apis/modules/home'
import { pca } from '@/apis/modules/consignee'
import store from '@/store'
import { tryLogin, reset } from '@/apis/modules/login'

export default {
  data() {
    return {
      currentShop: null,
      tenants: [],
      noarea: null,
      showSelector: false,
      selectedLv1: null,
      addressList: [],
      cityList: [],
      selectedLv2: -1,
      storeList: [],
      hasConfirm: false,
    }
  },
  computed: {
    cfg() {
      return this.$cfg
    },
    shop() {
      return store.state.user.tTitle
    },
  },
  async created() {
    // 保存之前的商户信息
    this.currentShop = {
      t: store.state.user.tId,
      area: store.state.user.tTitle,
      mainDepoId: store.state.user.mainDepoId,
      sid: store.state.user.depoId,
      shopTitle: store.state.user.depoTitle,
    }
    await this.getTenant()
    this.addressList = await pca()
  },
  onUnload() {
    if (!this.hasConfirm) {
      store.commit('SET_TENANT', this.currentShop)
    }
  },
  methods: {
    async getTenant() {
      var list = await tenant()
      this.tenants = list
      debugger
      this.selectedLv1 = list.filter((c) => c.id == store.state.user.tId)[0]
      setTimeout(async () => {
        await this.localGetCities()
      }, 500)
    },
    async backCurrent() {
      this.hasConfirm = true
      store.commit('SET_TENANT', this.currentShop)
      reset()
      try {
        await tryLogin()
      } catch (error) {}
      uni.reLaunch({ url: '/pages/index/index' })
    },
    async change(shop) {
      this.hasConfirm = true
      store.commit('SET_TENANT', {
        t: this.selectedLv1.id,
        area: this.selectedLv1.title,
        sid: shop.id,
        shopTitle: shop.title,
        mainDepoId: this.selectedLv1.mainDepositoryId,
      })
      reset()
      try {
        await tryLogin()
      } catch (error) {}
      uni.reLaunch({ url: '/pages/index/index' })
    },
    async localGetCities() {
      var list = await getCities()
      this.cityList = list.map((c) => {
        var provinceCode = Math.floor(c / 100)
        var province = this.addressList.filter((d) => d.value == provinceCode)[0]
        var city = province.children.filter((d) => d.value == c)[0]
        return { title: province.label + '-' + city.label, value: c }
      })
    },
    async swichMenu(c, i) {
      var item = this.tenants[i]
      if (this.selectedLv1 == i) return
      this.selectedLv1 = item
      store.commit('SET_TENANT', { t: item.id, area: item.title, mainDepoId: item.mainDepositoryId })
      this.cityList = []
      await this.localGetCities()
    },
    async swichCity(item, i) {
      this.selectedLv2 = i
      this.showSelector = false
      this.storeList = []
      this.storeList = await getStores(this.cityList[i].value)
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
