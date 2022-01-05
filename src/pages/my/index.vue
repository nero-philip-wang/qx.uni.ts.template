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
        <div class="mx-40 text-white flex">
          <div class="mx-32">
            <u-avatar :src="member.avatar" size="110rpx"></u-avatar>
          </div>
          <div class="flex-grow flex-col justify-center">
            <div class="text-white text-xl">{{ member.nickname }}</div>
            <div class="text-white text-sm">{{ member.desc }}</div>
          </div>
        </div>

        <div class="bg-primary absolute" style="height:330rpx;width:100%;top:0;left:0;z-index:-1"></div>
      </div>

      <!-- 资产 -->
      <Card :title="structofAsset.title" :more="structofAsset.more" :more-href="structofAsset.moreHref" :items="structofAsset.items" />
      <!-- 订单 -->
      <Card :title="structofOrder.title" :more="structofOrder.more" :more-href="structofOrder.moreHref" :items="structofOrder.items" />

      <div class="m-24 bg-white rounded overflow-hidden">
        <banner :params="list1" />
      </div>

      <div class="m-24 bg-white rounded">
        <u-cell-group :border="false">
          <u-cell icon="car" icon-color="#5fcda2" title="地址管理" is-link @click="$goto('pages/consignee/list')"></u-cell>
          <button open-type="contact" class="u-reset-button w-full text-left">
            <u-cell icon="kefu-ermai" icon-color="#ee883b" title="联系客服" is-link></u-cell>
          </button>
          <button open-type="contact" class="u-reset-button w-full text-left" send-message-title="售后咨询">
            <u-cell icon="bag" icon-color="#ee883b" title="售后咨询" is-link></u-cell>
          </button>
        </u-cell-group>
      </div>
    </scroll-view>
    <qx-tabbar :value="3" />
  </div>
</template>

<script>
import Card from './comp/card.vue'
import store from '@/store'
import { all } from '@/apis/modules/asset'
import { count } from '@/apis/modules/order'
import Enumerable from 'linq'
import { toYuan } from '@/utils/index'
import banner from '../index/comp/banner.vue'
import { section } from '../index/comp/meta'

var list1 = section()
list1.height = '160rpx'

export default {
  components: { Card, banner },
  data() {
    return {
      showTrigger: false,
      structofOrder: {
        title: '我的订单',
        more: '查看全部',
        moreHref: '',
        items: [
          { title: '待支付', badge: '0', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
          { title: '待发货', badge: '0', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
          { title: '待收货', badge: '0', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
          { title: '待评价', badge: '0', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
        ],
      },
      structofAsset: {
        title: '我的资产',
        moreHref: '',
        items: [
          { title: '储值', value: '1', href: '/pages/my/balance' },
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
      console.log(store.state)
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
  methods: {
    async refresh() {
      this.showTrigger = true
      var assets = await all()
      this.structofAsset.items[0].value = toYuan(Enumerable.from(assets).firstOrDefault((c) => c.type == 23)?.balance ?? '未开通')
      this.structofAsset.items[2].value = toYuan(Enumerable.from(assets).firstOrDefault((c) => c.type == 21)?.balance ?? '未开通')
      var number = await count()
      this.structofOrder.items[0].value = number.waitForPaying
      this.structofOrder.items[1].value = number.waitForWarehouseout
      this.structofOrder.items[2].value = number.waitForReceiving
      this.structofOrder.items[3].value = number.over
      this.showTrigger = false
    },
  },
}
</script>
