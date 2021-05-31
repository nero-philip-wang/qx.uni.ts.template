<template>
  <view class="app">
    <view class="cell row b-b">
      <text class="tit">收货人</text>
      <input v-model="data.name" class="input" type="text" maxlength="10" placeholder="请输入收货人姓名" placeholder-class="placeholder" />
    </view>
    <view class="cell row b-b">
      <text class="tit">手机号</text>
      <input
        v-model="data.mobile"
        class="input"
        type="number"
        maxlength="11"
        placeholder="请输入收货人手机号码"
        placeholder-class="placeholder"
      />
    </view>
    <view class="cell row b-b" @click="chooseAddress">
      <text class="tit">地址</text>
      <text class="input clamp" :class="{ placeholder: !address.addr }">
        {{ address.addr ? address.addr : '请在地图选择收货地址' }}
      </text>
      <text class="mix-icon icon-you"></text>
    </view>
    <view class="cell row b-b">
      <text class="tit">门牌号</text>
      <input
        v-model="address.room"
        class="input"
        type="text"
        maxlength="10"
        placeholder="请输入收货人姓名"
        placeholder-class="placeholder"
      />
    </view>
    <view class="cell row b-b">
      <text class="tit fill">设为默认地址</text>
      <switch :checked="data.is_default" color="#FF536F" @change="onSwitchChange" />
    </view>

    <u-button ref="confirmBtn" text="提交" margin-top="60rpx" @click="submit"></u-button>
  </view>
</template>

<script>
import { get, create, update } from '@/apis/modules/consignee'

// import { checkStr } from '@/common/js/util'
export default {
  data() {
    return {
      id: null,
      data: {
        is_default: true,
        address: {},
      },
      address: {
        pca: '',
        addr: '',
        room: '',
      },
    }
  },
  computed: {},
  async onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.data = await get(options.id)
      var detail = this.data.address
        .split(' ')
        .slice(3)
        .join(' ')
      this.address = {
        pca: this.data.address
          .split(' ')
          .slice(0, 3)
          .join(' '),
        addr: detail.split('@')[0],
        room: detail.split('@')[1],
      }
    }
  },
  methods: {
    async submit() {
      const data = this.data
      if (!data.name) {
        this.$util.msg('请输入收货人姓名')
        this.$refs.confirmBtn.stop()
        return
      }
      if (data.mobile.length != 11) {
        this.$util.msg('请输入正确的手机号码')
        this.$refs.confirmBtn.stop()
        return
      }
      data.address = `${this.address.pca} ${this.address.addr}@${this.address.room}`
      if (!data.address) {
        this.$util.msg('请选择收货地址')
        this.$refs.confirmBtn.stop()
        return
      }
      let res = {}
      if (this.id) {
        res = await update(data)
      } else {
        res = await create(data)
      }
      console.log(res)
      //   this.$util.msg(res.msg)
      //   if (res.status === 1) {
      //     this.$util.prePage().loadData()
      //     setTimeout(() => {
      //       uni.navigateBack()
      //     }, 1000)
      //   }
    },
    // 选择地址
    chooseAddress() {
      uni.chooseLocation({
        success: (res) => {
          const p = ['省', '区', '市', '州', '县']
          p.forEach((element) => {
            res.address = res.address.replace(new RegExp(`(${element})`, 'g'), '$1 ')
          })
          this.address = {
            pca: res.address
              .split(' ')
              .slice(0, 3)
              .join(' '),
            addr:
              res.address
                .split(' ')
                .slice(3)
                .join(' ') + res.name,
            room: '',
          }
          console.log(this.address)
        },
      })
    },
    // 选择地址回调
    setAddress(e) {
      console.log(JSON.stringify(e))
      this.data.address = e
    },
    onSwitchChange(e) {
      this.data.is_default = e.detail.value
    },
  },
}
</script>

<style scoped lang="scss">
.app {
  padding: 10rpx 44rpx 0;
}
.cell {
  height: 106rpx;

  .tit {
    min-width: 130rpx;
    font-size: 30rpx;
    color: #333;
  }
  .input {
    flex: 1;
    font-size: 30rpx;
    color: #333;
  }
  .icon-you {
    flex-shrink: 0;
    margin-right: 8rpx;
    margin-left: 40rpx;
    font-size: 24rpx;
    color: #aaa;
  }
  switch {
    transform: scale(0.8) translateX(10rpx);
    transform-origin: center right;
  }
}
</style>
