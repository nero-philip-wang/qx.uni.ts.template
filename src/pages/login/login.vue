<template>
  <view class="wrapper">
    <!-- <button class="button-info" open-type="getUserInfo" :disabled="isAuthed" @getuserinfo="getUserInfo">
			<image class="avatar" :src="userInfo.avatarUrl" />
			<view class="tip">{{ userInfo.nickName || '点击授权昵称及头像' }}</view>
		</button> -->
    <!-- <wux-select id="wux-select1" /> -->
    <!-- <view class="attribution" @click="choseClick">
			<view class="top">商户名称</view>
			<view class="chose">
				<input placeholder="请先选择再授权" v-model="inputVlaue" disabled="true"/>
				<view class="koifont arrow">&#xe610;</view>
			</view>
		</view> -->
    <block>
      <!-- <view class="mobile" v-if="!inputVlaue">手机授权</view> -->
      <button class="button-mobile" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机授权</button>
    </block>
    <!--  v-if="date < 1608566400000" -->
    <block>
      <view v-if="!inputState" style="margin-top:20rpx" @click="inputState = true">点击使用账号密码登录</view>
      <block v-if="inputState">
        <view class="phone"><input v-model="user" placeholder="请输入账号"/></view>
        <view class="phone"><input v-model="pass" placeholder="请输入密码" type="password"/></view>
        <view class="loginss" @click="logins">登录</view>
      </block>
    </block>
    <!-- 弹窗 -->
    <!-- 选择商户 -->
    <u-popup wux-class="popups" :visible="choseState" position="bottom" @close="choseState = false">
      <view class="bot-top">
        <view class="cancel" @click="choseState = false">取消</view>
        <view class="please">请选择</view>
        <view class="save" @click="save">确定</view>
      </view>
      <view class="bot-listBox">
        <view v-for="val in list" :key="val.id" class="bot-list" @click="listClick(val)">
          <view>{{ val.title }}</view>
          <view v-if="val.title == item.title" class="koifont list-icon">&#xe62a;</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { TryBindByMobile, salt, loginInByPw, loginByCode } from '@/apis/modules/login'
import md5Libs from 'uview-ui/libs/function/md5'
import store from '@/store'
import tenant from '@/config/current'
export default {
  data() {
    return {
      href: '',
      inputVlaue: '',
      choseState: false,
      list: [],
      item: null,
      user: '',
      pass: '',
      date: new Date().getTime(),
      inputState: false,
    }
  },
  async onLoad(options) {
	  // 如果没有 shaEncryptedData，那么赶紧获取
    if (!(store.state.user.sessionInfo && store.state.user.sessionInfo.shaEncryptedData)) await loginByCode()
    this.href = options.href ? decodeURIComponent(options.href) : '/pages/index/index'
  },
  methods: {
    async getPhoneNumber({ detail }) {
      if (detail.errMsg == 'getPhoneNumber:fail user deny' || detail.errMsg == 'getPhoneNumber:fail:user deny') {
        uni.showToast({
          title: '您已拒绝授权',
          icon: 'none',
          duration: 2000,
        })
      } else {
        const data = {
          provider: 'WechatMiniProgram',
          sourceMemberId: '', // 邀请人id currentInfo.sourceId
          sourceChannel: '', // source
          appId: tenant.appId,
          shaEncryptedData: store.state.user.sessionInfo.shaEncryptedData,
          encryptedData: detail.encryptedData,
          iv: detail.iv,
        }
        try {
          const rt = await TryBindByMobile(data)
          const reponse = rt.data.data
          const employee = reponse && reponse.extra && reponse.extra.employee
          if (employee) {
            const info = {
              token: 'Bearer ' + reponse.token,
              userId: reponse.user.id,
              title: reponse.user.nickName,
              avatar: reponse.user.avatar,
              tenantId: employee.departmentId > 99999999 ? parseInt(employee.departmentId / 10000) : employee.departmentId,
              shopId: employee.departmentId,
              employee: employee,
            }
            store.commit('SET_USERINFO', info)
            uni.reLaunch({
              url: this.href,
            })
          }
        } catch (err) {
          uni.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    },
    choseClick() {
      this.choseState = true
    },
    listClick(e) {
      this.item = e
    },
    save() {
      this.choseState = false
      this.inputVlaue = this.item.title
      uni.setStorageSync('tentant', this.item.id)
      currentInfo.tentant = this.item.id
    },
    // async getTentants(){
    // 	let res = await api.tentants()
    // 	this.list = res
    // },
    async logins() {
      if (this.user && this.pass) {
        try {
          const userword = await salt(this.user)
          const password = md5Libs.md5(md5Libs.md5(this.pass + '.' + userword.data.data))
          const res = await loginInByPw(this.user, { password: password, channel: 2 })
          if (res.data.code == 403) {
            uni.showToast({
              title: '账户密码不正确，请重试',
              icon: 'none',
              duration: 2000,
            })
          } else {
            const reponse = res.data.data
            const employee = reponse && reponse.extra && reponse.extra.employee
            if (employee) {
              const info = {
                token: 'Bearer ' + reponse.token,
                userId: reponse.user.id,
                title: reponse.user.nickName,
                avatar: reponse.user.avatar,
                tenantId: employee.departmentId > 99999999 ? parseInt(employee.departmentId / 10000) : employee.departmentId,
                shopId: employee.departmentId,
                employee: employee,
              }
              store.commit('SET_USERINFO', info)
            }
            if (reponse) {
              uni.reLaunch({
                url: this.href,
              })
            }
          }
        } catch (err) {
          var msg = ''
          if (err.message == 'user not found') msg = '此用户不存在'
          else if (err.message == '您没有登录后台的权限') msg = '账户未开通导购功能，请联系总部开通'
          else msg = err.message
          uni.showToast({
            title: msg,
            icon: 'none',
            duration: 2000,
          })
        }
      } else {
        uni.showToast({
          title: '请输入账号或密码',
          icon: 'none',
          duration: 2000,
        })
      }
    },
  },
}
</script>
<style>
page {
  height: 100%;
  background: #ffffff;
}
</style>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.button-info::after {
  display: none;
}
.button-info {
  padding-bottom: 100rpx;
  color: #333 !important;
  background-color: #fff !important;
}
.avatar {
  display: block;
  width: 160rpx;
  height: 160rpx;
  margin: 84rpx auto 40rpx;
}
.tip {
  width: 600rpx;
  margin: 0 auto;
  font-size: 30rpx;
  line-height: 1;
}

.button-mobile {
  width: 543rpx;
  height: 88rpx;
  margin: 0rpx auto;
  font-size: 34rpx;
  line-height: 88rpx;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  background: rgba(86, 206, 203, 1);
  border-radius: 44rpx;
}
.button__plain {
  width: 543rpx;
  height: 88rpx;
  margin: 20rpx auto 0;
  font-size: 32rpx;
  line-height: 88rpx;
  color: rgba(86, 206, 203, 1);
  text-align: center;
  background: #fff;
  border: 1rpx solid rgba(86, 206, 203, 1);
  border-radius: 44rpx;
}
.inviteInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 543rpx;
  height: 30rpx;
  margin: 225rpx auto 0;
  font-size: 26rpx;
  color: rgba(153, 153, 153, 1);
}
.attribution {
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  .top {
    font-size: 34rpx;
    color: #333333;
  }
  .chose {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    input {
      text-align: right;
      font-size: 30rpx;
    }
    .arrow {
      font-size: 26rpx;
      color: #999999;
    }
  }
}
.bot-top {
  height: 100rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .cancel {
    font-size: 32rpx;
    color: #999999;
  }
  .please {
    color: #333333;
    font-size: 36rpx;
  }
  .save {
    font-size: 32rpx;
    color: #999999;
  }
}
.bot-listBox {
  height: 448rpx;
  overflow-y: auto;
  overflow-x: hidden;
}
.bot-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  color: #666666;
  font-size: 28rpx;
  height: 90rpx;
  border-bottom: 2rpx solid #f1f1f1;

  .list-icon {
    font-size: 30rpx;
    color: $color;
  }
}
.bot-list:last-child {
  border: none;
}
.mobile {
  width: 543rpx;
  height: 88rpx;
  background: #dddddd;
  border-radius: 44rpx;
  line-height: 88rpx;
  font-size: 36rpx;
  text-align: center;
  color: #ffffff;
}
.phone {
  width: 70%;
  input {
    width: 100%;
    height: 120rpx;
    line-height: 120rpx;
    border-bottom: 2rpx solid #cccccc;
  }
}
.loginss {
  width: 400rpx;
  height: 72rpx;
  background: #00b2b6;
  text-align: center;
  line-height: 72rpx;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 36rpx;
  margin-top: 50rpx;
}
</style>
