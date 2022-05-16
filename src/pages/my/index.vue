<template>
  <div class="h-page flex">
    <scroll-view
      scroll-y
      refresher-enabled
      scroll-with-animation
      class="flex-grow"
      :refresher-triggered="showTrigger"
      @refresherrefresh="refresh"
    >
      <div style="height:200rpx" class="pt-64">
        <!-- 头像 -->
        <div class="mx-40 text-white flex" @click="!isLogged && $goto('/pages/login/login')">
          <div class="mx-32 relative">
            <u-avatar :src="member.avatar" size="110rpx"></u-avatar>
            <image v-if="member.level && member.level.icon" :src="member.level.icon" class="absolute rounded-full memberlevel"></image>
          </div>
          <div class="flex-grow flex-col justify-center">
            <div class="text-white text-xl">{{ member.nickname }}</div>
            <div class="mt-4 text-white text-sm">{{ (member.level && member.level.title) || '普通会员' }}</div>
          </div>
          <div class=" flex-col justify-center" @click="showMemberLv = true">
            <div class="right text-sm">会员权益</div>
          </div>
        </div>

        <div class="bg-primary absolute bgcard"></div>
      </div>

      <!-- 资产 -->
      <Card :title="structofAsset.title" :more="structofAsset.more" :more-href="structofAsset.moreHref" :items="structofAsset.items" />
      <!-- 订单 -->
      <Card :title="structofOrder.title" :more="structofOrder.more" :more-href="structofOrder.moreHref" :items="structofOrder.items" />

      <!-- <div class="m-24 bg-white rounded overflow-hidden">
        <banner :params="list1" />
      </div> -->

      <div class="m-24 bg-white rounded">
        <u-cell-group :border="false">
          <u-cell icon="car" icon-color="#5fcda2" title="地址管理" is-link @click="$goto('pages/consignee/list')"></u-cell>
          <button open-type="contact" class="u-reset-button w-full text-left">
            <u-cell icon="kefu-ermai" icon-color="#ee883b" title="联系客服" is-link></u-cell>
          </button>
          <button open-type="contact" class="u-reset-button w-full text-left" send-message-title="售后咨询">
            <u-cell icon="bag" icon-color="#ee883b" title="售后咨询" is-link></u-cell>
          </button>
          <u-cell icon="car" icon-color="#5fcda2" title="退出登录" is-link @click="logout"></u-cell>
        </u-cell-group>
      </div>
    </scroll-view>
    <qx-tabbar :value="3" />
    <Memberlv :show.sync="showMemberLv" />
  </div>
</template>

<script>
import Card from './comp/card.vue'
import Memberlv from './comp/memberlv.vue'
import store from '@/store'
import easyState from '@/store/easyState'
import { all } from '@/apis/modules/asset'
import { count } from '@/apis/modules/order'
import from from '@/utils/linq'
import { toYuan } from '@/utils/index'
import banner from '../index/comp/banner.vue'
import { section } from '../index/comp/meta'
import { loginByCode } from '@/apis/modules/login'

var list1 = section()
list1.height = '160rpx'

export default {
  components: { Card, banner, Memberlv },
  data() {
    return {
      showMemberLv: false,
      showTrigger: false,
      structofOrder: {
        title: '我的订单',
        more: '查看全部',
        moreHref: '/pages/order/list',
        items: [
          { title: '待支付', badge: '0', icon: 'qx-daifukuan', href: '/pages/order/list?status=1' },
          { title: '待发货', badge: '0', icon: 'qx-daifahuo', href: '/pages/order/list?status=2' },
          { title: '待收货', badge: '0', icon: 'qx-daishouhuo', href: '/pages/order/list?status=3' },
          { title: '待评价', badge: '0', icon: 'qx-yiwancheng', href: '/pages/order/list?status=4' },
        ],
      },
      structofAsset: {
        title: '我的资产',
        moreHref: '',
        items: [
          { title: '储值', value: '0', href: '/pages/my/balance' },
          // { title: '积分', value: '0', href: '' },
          { title: '卡券', value: '查看', href: '/pages/my/coupon' },
          { title: '返利', value: '0', href: '/pages/my/wallet' },
        ],
      },
      list1,
      structofBanner: {
        height: '160rpx',
      },
    }
  },
  computed: {
    member() {
      return store.getters.isLogged
        ? store.state.user.logged
        : {
            nickname: '未登录',
            desc: '',
            avatar: '-',
          }
    },
    isLogged() {
      return store.getters.isLogged
    },
  },
  beforeCreate() {
    uni.hideTabBar()
  },
  onLoad() {
    this.refresh()
  },
  onShow() {
    this.RefreshMember()
  },
  methods: {
    async refresh() {
      this.showTrigger = true
      try {
        var assets = await all()
        this.structofAsset.items[0].value = toYuan(from(assets).firstOrDefault((c) => c.type == 21)?.balance ?? '未开通')
        this.structofAsset.items[2].value = toYuan(from(assets).firstOrDefault((c) => c.type == 23)?.balance ?? '未开通')
      } catch (error) {}
      try {
        var number = await count()
        this.structofOrder.items[0].badge = number.waitForPaying
        this.structofOrder.items[1].badge = number.waitForWarehouseout
        this.structofOrder.items[2].badge = number.waitForReceiving
        this.structofOrder.items[3].badge = number.over
      } catch (error) {}
      this.showTrigger = false
    },
    async RefreshMember() {
      if (easyState.needRefreshMember) {
        var user = await loginByCode(true)
        easyState.needRefreshMember = false
      }
    },
  },
}
</script>
<style scoped lang="scss">
.bgcard {
  height: 330rpx;
  width: 140%;
  top: 0;
  left: -20%;
  z-index: -1;
  border-radius: 0 0 50% 50%;
}
.memberlevel {
  width: 42rpx;
  height: 42rpx;
  right: -10rpx;
  bottom: 4rpx;
}
.right {
  background-color: $u-primary-disabled;
  padding: 12rpx 24rpx;
  border-radius: 50rpx 0 0 50rpx;
  margin-right: -40rpx;
}
</style>
