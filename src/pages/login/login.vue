<template>
  <div class="wrapper">
    <u-avatar :src="wechatUserInfo.avatar" :size="120" @click="getUserInfo"></u-avatar>
    <div class="text-gray text-xl spread" @click="getUserInfo">
      {{ wechatUserInfo.nickname }}
    </div>
    <button v-if="step === 1" class="btn u-reset-button" @click="getUserInfo">
      一键设置头像昵称
    </button>
    <button v-else class="btn u-reset-button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
      微信一键登录
    </button>
  </div>
</template>

<script>
import { loginByCode, TryBindByMobile } from '@/apis/modules/login'

export default {
  data() {
    return {
      step: 1,
      wechatUserInfo: {
        avatar: '-',
        nickname: '点击按钮授权微信头像和昵称',
      },
      newUserInfo: {},
      loadding: true,
    }
  },

  async onShow() {
    try {
      var user = await loginByCode(true)
      console.log(user)
      this.$goto(-1)
    } catch (error) {
      this.newUserInfo = error
    } finally {
      this.loadding = false
    }
  },
  methods: {
    getUserInfo() {
      uni.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.wechatUserInfo.avatar = res.userInfo.avatarUrl
          this.wechatUserInfo.nickname = res.userInfo.nickName
        },
        complete: () => {
          this.step++
        },
      })
    },
    getPhoneNumber(res) {
      if (res.detail.errMsg.indexOf('ok') == -1) {
        uni.showToast({
          title: '请允许绑定手机号完成注册',
          icon: 'none',
        })
      } else {
        // 注册新用户
        var timer = setInterval(async () => {
          // eslint-disable-next-line no-useless-return
          if (this.loadding) return
          else {
            clearInterval(timer)
            await this.signup(res.detail)
          }
        }, 500)
      }
    },
    async signup(wxdata) {
      try {
        var user = await TryBindByMobile({
          ...this.newUserInfo,
          ...wxdata,
          ...this.wechatUserInfo,
        })
        this.$goto(-1)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  width: 100%;
  padding: 10%;
  padding-top: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.spread {
  margin-top: 5vh;
  margin-bottom: 30vh;
}
.btn {
  border-radius: 88rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  border: 2rpx solid #fff;
  background-color: $u-primary !important;
  color: #fff;
  letter-spacing: 4rpx;
  width: 100%;
}
</style>
