<template>
  <div>
    <div style="height:200rpx" class="pt-64">
      <!-- 头像 -->
      <div class="mx-40 text-white flex">
        <div class="mx-32 relative">
          <u-avatar :src="member.avatar" size="110rpx"></u-avatar>
          <image v-if="member.level && member.level.icon" :src="member.level.icon" class="absolute rounded-full memberlevel"></image>
        </div>
        <div class="flex-grow flex-col justify-center">
          <div class="text-white text-xl">{{ member.nickname }}</div>
          <div class="mt-4 text-white text-sm">{{ (member.level && member.level.title) || '分销员' }}</div>
        </div>
        <div class="flex-col justify-center place-items-center right" @click="showQr">
          <div class="qxfont">&#xe626;</div>
          <div class="text-xs">我的邀请码</div>
        </div>
      </div>

      <div class="absolute bgcard"></div>
    </div>

    <!-- 资产 -->
    <Card :title="structofAsset.title" :more="structofAsset.more" :more-href="structofAsset.moreHref" :items="structofAsset.items" />

    <div class="mx-32 my-8 flex" @click="$goto('/pagesA/saler/order')">
      <span class="text-base">近期分销订单</span>
      <span class="text-sm flex-grow ml-16 pt-8 text-gray">{{ params.subtitle }}</span>
      <span class="text-sm pt-8 text-gray">查看全部 ></span>
    </div>
    <Order v-for="x in 10" :key="x"> </Order>
  </div>
</template>

<script>
import Card from './comp/card.vue'
import Order from './comp/order.vue'
import store from '@/store'

export default {
  components: { Card, Order },
  data() {
    return {}
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
    structofAsset() {
      return {
        title: '我的数据',
        moreHref: '',
        items: [
          { title: '钱包', value: '0', href: '/pages/my/wallet' },
          { title: '粉丝', value: '0', href: '/pagesA/saler/fans' },
          { title: '今日预计', value: '0', href: '/pagesA/saler/order' },
        ],
      }
    },
  },
  methods: {
    showQr() {
      uni.previewImage({ urls: ['https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/6acec660-4f31-11eb-a16f-5b3e54966275.jpg'] })
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
  background: linear-gradient(136deg, #ec3d3d 0%, #ff7459 100%);
}

.right .qxfont {
  font-size: 32rpx;
}
</style>
