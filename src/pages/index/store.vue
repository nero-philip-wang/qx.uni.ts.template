<template>
  <div class="page">
    <div class="bg-white p-24 flex text-base line-h-48 z-10080">
      <div v-if="enabledTenant" class="flex maxwidth" @click="showTenant = !showTenant">
        <span class="mr-8">ucosy直营</span>
        <u-icon :name="showTenant ? 'arrow-down' : 'arrow-right'" size="24rpx"></u-icon>
      </div>

      <div class="flex ml-24 maxwidth" @click="showCity = !showCity">
        <span class="mr-8">江苏 · 南京</span>
        <u-icon :name="showCity ? 'arrow-down' : 'arrow-right'" size="24rpx"></u-icon>
      </div>

      <div class="flex-grow ml-24 searchwidth">
        <u-search placeholder="请输入店铺名称" :clearabled="true" :show-action="false" height="48rpx"></u-search>
      </div>
    </div>

    <u-popup :show="showTenant" :overlay-opacity="0" close-on-click-overlay mode="top" bg-color="transparent" @close="showTenant = false">
      <div class="bb-1 bs" @click="showTenant = false">
        <div style="height:80rpx" @click="showTenant = false"></div>
        <div class="bg-white p-32">
          <div class="flex flex-wrap">
            <span v-for="c in tenants" :key="c.id" class="m-16">
              <u-tag :text="c.area" plain type="info" color="#272727" @click="change(c)" />
            </span>
          </div>
        </div>
      </div>
    </u-popup>

    <u-popup :show="showCity" :overlay-opacity="0" close-on-click-overlay mode="top" bg-color="transparent" @close="showCity = false">
      <div class="bb-1 bs">
        <div style="height:80rpx" @click="showCity = false"></div>
        <div class="bg-white p-32">
          <div class="flex flex-wrap">
            <span v-for="c in tenants" :key="c.id" class="m-16">
              <u-tag :text="c.area" plain type="info" color="#272727" @click="change(c)" />
            </span>
          </div>
        </div>
      </div>
    </u-popup>

    <!-- 我常用的 -->
    <div class="bg-white">
      <div class="open flex flex-wrap mt-24 px-28 pt-32 pb-16"><u-icon name="bookmark" size="32rpx"></u-icon> 我常用的</div>
      <u-cell-group :border="false">
        <u-cell v-for="i in 2" :key="i" title="夕阳无限好" label="地址：南岳路35-250 2楼35号 \n营业时间：早10-晚10">
          <div slot="right-icon" class="flex-col align-center ">
            <u-radio />
            <div class="mt-8 text-gray text-sm">距您 253m</div>
          </div>
        </u-cell>
      </u-cell-group>
    </div>

    <!-- 门店列表 -->
    <div class="bg-white">
      <div class="open flex flex-wrap mt-24 px-28 pt-32 pb-16">
        <span>门店列表</span>
        <span class="flex-grow"> </span>
        <span class="text-sm text-address truncate">当前位置：琅琊路352-522商城4514561565615</span>
        <span class="text-sm text-primary">重新定位</span>
      </div>
      <u-cell-group :border="false">
        <u-cell v-for="i in 2" :key="i" title="夕阳无限好" label="地址：南岳路35-250 2楼35号 \n营业时间：早10-晚10">
          <div slot="right-icon" class="flex-col align-center ">
            <u-radio />
            <div class="mt-8 text-gray text-sm">距您 253m</div>
          </div>
        </u-cell>
      </u-cell-group>
    </div>
  </div>
</template>

<script>
import { tenant } from '@/apis/modules/home'
import store from '@/store'
import { tryLogin, reset } from '@/apis/modules/login'

export default {
  data() {
    return {
      enabledTenant: false,
      tenants: [],
      showTenant: false,
      showCity: false,
    }
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
  },
}
</script>

<style lang="scss" scoped>
.line-h-48 {
  line-height: 48rpx;
}
.maxwidth {
  max-width: 200rpx;
}
.z-10080 {
  z-index: 10080;
}
.searchwidth {
  width: 300rpx;
}

.text-address {
  max-width: 400rpx;
}

.open {
  font-size: 28rpx;
  line-height: 40rpx;
  color: #464646;
  height: 40rpx;
  margin-bottom: 12px;
}
</style>
