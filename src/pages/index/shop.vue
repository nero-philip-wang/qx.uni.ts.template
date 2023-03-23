<template>
  <div class="page">
    <div class="bg-white px-32 pb-8 flex" style="z-index: 200;">
      <div class="left flex py-16 pr-32 align-items-center open" @click="showSelector = !showSelector">
        <u-icon name="map" size="32rpx"></u-icon>
        <span class="mx-8">{{ currentShop.tenant }}</span>
        <!-- <span class="mx-8 text-gray">|</span> -->
        <!-- <span class="mr-8"> 先锋店</span> -->
        <u-icon name="arrow-down-fill" size="26rpx"></u-icon>
      </div>
      <u-search v-model="keyword" placeholder="搜索店铺" :show-action="false" @focus="showSelector = false"></u-search>
    </div>

    <div class="my-16 bg-white">
      <u-cell-group>
        <u-cell size="large" :title="storedShop.subTitle" is-link @click="$goto(-1)">
          <template v-slot:label>
            <div class="text-gray text-sm">{{ storedShop.consignee.address }}</div>
            <div class="text-gray text-sm">营业时间：{{ storedShop.workHour }}</div>
          </template>
          <template v-slot:right-icon>
            <div class="ml-16 text-primary text-sm">当前</div>
          </template>
        </u-cell>
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
        <u-cell v-for="item in storeList" :key="item.id" size="large" :title="item.title" is-link @click="confirm(item)">
          <template v-slot:label>
            <div class="text-gray text-sm">{{ item.consignee.address }}</div>
            <div class="text-gray text-sm">营业时间：{{ item.workHour }}</div>
          </template>
          <template v-slot:right-icon>
            <div class="ml-16 text-gray text-sm">距离 {{ item.distanceText }}</div>
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
            :key="item.id"
            class="text-base lv1_item"
            :class="{ active: item.id == selectedTenantId }"
            @click="switchTenant(item, i)"
          >
            {{ item.subTitle }}
          </div>
        </scroll-view>

        <div class="right">
          <div v-for="(item, i) in cityList" :key="item.code" class="ml-12 p-24 text-base text-black-38 bb-1" @click="switchCity(item, i)">
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
import api from '@/apis'

export default {
  data() {
    return {
      currentShop: null,
      tenants: [],
      noarea: null,
      showSelector: false,
      selectedTenantId: null,
      addressList: [],
      cityList: [],
      selectedCityIdx: -1,
      storeList: [],
      hasConfirm: false,
      position: null,
    }
  },
  computed: {
    cfg() {
      return this.$cfg
    },
    shop() {
      return store.state.share.shop
    },
    storedShop() {
      return store.state.user.shop
    },
  },
  async created() {
    // 保存之前的商户信息
    this.currentShop = { ...store.state.share }
    this.tenants = await tenant()
    await this.initDefalutSelection()
  },
  methods: {
    async initDefalutSelection() {
      this.selectedTenantId = store.state.share.tid
      await this.getTenantCities(this.selectedTenantId)
      this.position = await api.location.getCity()
      this.getSortedShops(this.cityList[0]?.value)
    },
    async getTenantCities(tenantId) {
      var list = await getCities(tenantId)
      var pcaList = await pca()
      this.cityList = list.map((c) => {
        var provinceCode = Math.floor(c / 100)
        var province = pcaList.filter((d) => d.value == provinceCode)[0]
        var city = province.children.filter((d) => d.value == c)[0]
        return { title: province.label + '-' + city.label, value: c }
      })
    },
    async switchTenant(item, i) {
      if (this.selectedTenantId == item.id) return
      this.selectedTenantId = item.id
      this.cityList = []
      await this.getTenantCities(item.id)
    },
    async switchCity(item, i) {
      item = this.cityList[i]
      this.selectedCityIdx = i
      this.showSelector = false
      this.storeList = []
      await this.getSortedShops(item.value)
    },
    async getSortedShops(cid) {
      var result = await getStores(cid)
      result.forEach((item) => {
        var d = this.getDistance(item.location.y, item.location.x)
        item.distance = d[0]
        item.distanceText = d[1]
      })
      this.storeList = result.sort((a, b) => a.distance - b.distance)
    },
    // 计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    getDistance(lat1, lng1) {
      var lat2, lng2
      if (this.position) {
        lat2 = this.position.latitude
        lng2 = this.position.longitude
      }
      var Rad = (d) => (d * Math.PI) / 180.0
      var radLat1 = Rad(lat1)
      var radLat2 = Rad(lat2)
      var a = radLat1 - radLat2
      var b = Rad(lng1) - Rad(lng2)
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
      s = s * 6378137 // EARTH_RADIUS;
      var result = s > 100 * 1000 ? '大于100km' : s > 1000 ? (s / 1000).toFixed(1) + 'km' : s.toFixed(0) + 'm'
      return [s, result]
    },
    confirm(item) {
      store.commit('SET_SHARE_INFO', { sid: item.id, shop: item.subTitle, tid: item.tenantId, tenant: item.tenant.subTitle })
      store.commit('SET_SHOP', item)
      this.$goto(-1)
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
