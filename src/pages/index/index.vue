<template>
  <view>
    <view>- 使用画布画图</view>
    <qx-painter :board="c"></qx-painter>
    <view>- 使用iconfont</view>
    <view class="icon-c">&#xe6e1;</view>
    <view>- goto跳转</view>

    <u-button @click="$goto('/pages/index/home')">内部</u-button>
    <u-button @click="$goto('/pages/index/home', { appid: 'wx0391827cea01adfe' })">小程序</u-button>
    <u-button @click="$goto('https://www.iconfont.cn/')">网页</u-button>
    <u-button @click="$goto('https://www.iconfont.cn/', { way: 'replace' })">替换网页</u-button>
    <u-button @click="$goto('https://www.iconfont.cn/', { way: 'reLaunch' })">替换网页</u-button>
    <view>- 二维码</view>
    <qx-qrcode text="https://www.iconfont.cn/" :options="{ color: '#1eb1ad' }" />
    <u-cell title="选择地址" :label="titles">
      <CityPicker v-model="titles" :level="2" />
    </u-cell>

    <qx-tabbar />
  </view>
</template>
<script>
import CityPicker from '@/components/common/CityPicker'
import state from '@/store/easyState'

export default {
  components: { CityPicker },
  data() {
    return {
      state,
      titles: 0,
      wxacode: '',
      c: {
        width: '750rpx',
        height: '500rpx',
      },
      painter: {
        width: '750rpx',
        height: '500rpx',
        views: [
          {
            type: 'view',
            css: {
              left: '0rpx',
              top: '0rpx',
              background: '#07c160',
              width: '120rpx',
              height: '120rpx',
            },
          },
          {
            type: 'view',
            css: {
              left: '180rpx',
              top: '18rpx',
              background: '#1989fa',
              width: '80rpx',
              height: '80rpx',
              transform: 'transform: rotate(50deg)',
            },
          },
          {
            type: 'image',
            src: '',
            css: {
              left: '100rpx',
              top: '100rpx',
              width: '300rpx',
              height: '300rpx',
            },
          },
          {
            type: 'qrcode',
            text: 'https://www.baidu.com',
            css: {
              left: '380rpx',
              top: '230rpx',
              width: '200rpx',
              height: '200rpx',
              color: '#1989fa',
              backgroundColor: 'rgba(25,137,250,.1)',
              border: '20rpx solid rgba(25,137,250,.1)',
            },
          },
        ],
      },
    }
  },
  async mounted() {
    // var data = await this.getWxaCode()
    // this.painter.views[2].src = data
    this.c = this.painter
  },
  beforeCreate() {
    uni.hideTabBar()
  },
  methods: {},
}
</script>
