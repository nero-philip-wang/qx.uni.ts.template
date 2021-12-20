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

      <div class="m-24 bg-white rounded">
        <u-swiper :list="list1" :height="structofBanner.height"></u-swiper>
      </div>

      <div class="m-24 bg-white rounded">
        <u-cell-group :border="false">
          <u-cell icon="car" icon-color="#5fcda2" title="地址管理" is-link></u-cell>
          <button open-type="contact" class="u-reset-button w-full text-left ">
            <u-cell icon="server-man" icon-color="#ee883b" title="联系客服" is-link></u-cell>
          </button>
        </u-cell-group>
      </div>
    </scroll-view>
    <qx-tabbar :value="3" />
  </div>
</template>

<script>
import Card from './comp/card.vue'

export default {
  components: { Card },
  data() {
    return {
      showTrigger: false,
      structofOrder: {
        title: '我的订单',
        more: '查看全部',
        moreHref: '',
        items: [
          { title: '待支付', badge: '1', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
          { title: '待发货', badge: '0', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
          { title: '待收货', badge: '3', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
          { title: '待评价', badge: '0', icon: 'https://cdn.uviewui.com/uview/album/1.jpg', href: '' },
        ],
      },
      structofAsset: {
        title: '我的资产',
        moreHref: '',
        items: [
          { title: '余额', value: '1', href: '' },
          // { title: '积分', value: '0', href: '' },
          { title: '卡券', value: '3', href: '' },
          { title: '返利', value: '0', href: '' },
        ],
      },
      list1: [
        'https://cdn.uviewui.com/uview/swiper/swiper1.png',
        'https://cdn.uviewui.com/uview/swiper/swiper2.png',
        'https://cdn.uviewui.com/uview/swiper/swiper3.png',
      ],
      structofBanner: {
        height: '160rpx',
      },
      member: {
        logged: false,
        nickname: '未登录',
        desc: '',
        avatar: '-',
      },
    }
  },
  beforeCreate() {
    uni.hideTabBar()
  },
  methods: {
    refresh() {
      this.showTrigger = true
      setTimeout(() => {
        this.showTrigger = false
      }, 800)
    },
  },
}
</script>
