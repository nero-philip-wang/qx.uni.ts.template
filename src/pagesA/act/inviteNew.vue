<template>
  <view class="relative">
    <swiper class="absolute header" vertical autoplay :interval="3000" circular disable-touch :touchable="false">
      <swiper-item v-for="i in mobiles" :key="i">尾号{{ i }}的用户邀请了一个好友，已获得奖励 </swiper-item>
    </swiper>

    <button class="absolute share u-reset-button" open-type="share"> </button>
    <div class="absolute qr"></div>
    <div class="absolute record flex">
      <div class="flex-grow text-center">
        <div class="value">{{ summary.newMember || 0 }} <span>人</span> </div>
        <div class="tips">已邀请好友</div>
      </div>
      <div class="flex-grow text-center">
        <div class="value">{{ summary.newTradeMember || 0 }} <span>人</span></div>
        <div class="tips">完成订单好友</div>
      </div>
      <div class="flex-grow text-center">
        <div class="value">{{ summary.awardPrice || 0 }} <span>元</span></div>
        <div class="tips">奖励总价值</div>
      </div>
    </div>
    <image class="full" :src="act.image" mode="widthFix"></image>
  </view>
</template>

<script>
import { myInvite } from '@/apis/modules/activity'
import shareLite from '@/utils/share/lite'

export default {
  mixins: [shareLite],
  data() {
    return {
      mobiles: [],
      act: {},
      summary: {},
    }
  },
  async created() {
    for (let i = 0; i < 10; i++) {
      this.mobiles.push((Math.random() * 10000).toFixed(0).padStart(4, 0))
    }
    var my = await myInvite()
    this.act = my.act
    this.summary = my.summary
    uni.$u.liteShare.title = this.act.description
    uni.$u.liteShare.image = this.act.cover
  },
}
</script>

<style scoped lang="scss">
.full {
  width: 100%;
  line-height: 0;
}
.header {
  width: 750rpx;
  height: 75rpx;
  color: #fff;
  line-height: 75rpx;
  padding-left: 32rpx;
}
.share {
  top: 900rpx;
  left: 100rpx;
  width: 560rpx;
  height: 110rpx;
}

.qr {
  top: 1020rpx;
  left: 100rpx;
  width: 560rpx;
  height: 50rpx;
}
.record {
  top: 1540rpx;
  left: 60rpx;
  width: 620rpx;
  height: 200rpx;
  .value {
    font-size: 42rpx;
    color: #e82721;
    font-weight: 900;
    span {
      padding-left: 8rpx;
      font-size: 26rpx;
    }
  }
  .tips {
    padding-top: 8rpx;
    color: #9c846a;
    font-weight: 900;
  }
}
</style>
