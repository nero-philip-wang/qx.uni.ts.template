<template>
  <div class="h-page flex flex-col align-center px-80" style="padding-top: 40%;">
    <u-avatar :src="wechatUserInfo.avatar" size="200rpx"></u-avatar>
    <input
      v-model="wechatUserInfo.nickname"
      :focus="step == 2"
      class="mt-40 text-gray text-xl text-center"
      type="nickname"
      placeholder="点击填写昵称"
    />
    <div class="mt-80 w-full">
      <button
        v-if="step === 1"
        class="u-reset-button rounded-sm py-20 bg-primary text-white"
        open-type="chooseAvatar"
        @chooseavatar="chooseAvatar"
      >
        设置头像和昵称
      </button>
      <button
        v-else
        :disabled="!hasCode"
        class="u-reset-button rounded-sm py-20 bg-primary text-white"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        @click="step = 3"
      >
        微信一键登录
      </button>
    </div>
    <div class="flex-grow">
      <input :focus="step == 3" class="" />
    </div>
  </div>
</template>

<script>
import { loginByCode, TryBindByMobile, cache } from '@/apis/modules/user'
import api from '@/apis'

export default {
  data() {
    return {
      step: 1,
      wechatUserInfo: {
        avatar: null,
        nickname: null,
      },
      newUserInfo: {},
      loadding: true,
      hasCode: false,
    }
  },

  async onShow() {
    var result = await loginByCode(true)
    if (result.token) this.$goto(-1)
    else this.hasCode = true
  },
  methods: {
    async chooseAvatar(res) {
      this.wechatUserInfo.avatar = res.detail.avatarUrl
      var utoken = await api.upload.upload('user/avatar', res.detail.avatarUrl, '.png')
      this.wechatUserInfo.avatar = utoken
      this.step = 2
    },
    async getPhoneNumber(res) {
      if (res.detail.errMsg.indexOf('ok') == -1) {
        uni.showToast({
          title: '请允许绑定手机号完成注册',
          icon: 'none',
        })
      } else {
        // 注册新用户
        await this.signup({ ...res.detail, ...this.wechatUserInfo })
      }
    },
    async signup(wxdata) {
      try {
        var result = await TryBindByMobile(wxdata)
        if (result.token) this.$goto(-1)
        else console.log('注册失败', result)
      } catch (error) {
        console.log('注册失败', error)
      }
    },
  },
}
</script>
