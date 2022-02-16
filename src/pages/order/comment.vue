<template>
  <view class="app">
    <view class="wrap">
      <view v-for="(item, index) in list" :key="index" class="list">
        <item :value="item" />
        <view class="star-wrap row">
          <div class="my-8 mx-4 flex text-base">
            <div class="flex-grow">您对服务还满意吗</div>
            <div class="text-gray">{{ item.title }}</div>
          </div>
          <u-rate v-model="item.rating" :count="5" size="48rpx"></u-rate>
        </view>
        <view class="textarea-wrap">
          <textarea
            v-model="item.content"
            maxlength="100"
            placeholder="分享一下购物体验，让大家了解一下吧"
            placeholder-style="color:#999"
          />
        </view>
        <view class="upload-wrap">
          <u-upload
            multiple
            :max-size="5 * 1024 * 1024"
            :size-type="['compressed']"
            :max-count="9"
            :name="index"
            :file-list="item.images"
            @afterRead="(e) => afterRead(index, e)"
            @delete="(e) => deletePic(index, e)"
          ></u-upload>
        </view>
      </view>
    </view>
    <view class="btn-wrap">
      <u-button type="primary" shape="circle" @click="confirm">提交</u-button>
    </view>
  </view>
</template>

<script>
import { get, comment } from '@/apis/modules/order.js'
import { gettoken } from '@/apis/modules/upload.js'
import item from '../cart/comp/cartItem.vue'
import store from '@/store'

const URL = 'https://s.re4.top/'
const getSuffix = function(filename) {
  const pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos !== -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

export default {
  components: {
    item,
  },
  data() {
    return {
      id: null,
      list: [{ images: [] }],
      form: {},
      times: 0,
      imgs: [],
    }
  },

  async onLoad(options) {
    this.id = options.id
    // 加载订单
    const data = await get(this.id)
    this.list = data.items.map((item) => {
      item.rating = 5
      item.content = ''
      item.images = []
      return Object.assign({}, item)
    })
    // 加载阿里云参数
    var res = await gettoken('comment/test')
    this.form = {
      url: res.url,
      path: res.path,
      policy: res.policy,
      signature: res.signature,
      OSSAccessKeyId: res.ossAccessKeyId,
    }
  },
  methods: {
    afterRead(idx, event) {
      this.list[idx].images.push(...event.file)
      event.file.forEach(async (file) => {
        var addition = `${++this.times}${getSuffix(file.url)}`
        var [err] = await uni.uploadFile({
          url: URL,
          filePath: file.url,
          formData: { ...this.form, key: `${this.form.path}${addition}` },
          name: 'file',
        })
        var matched = this.list[idx].images.find((c) => c.url == file.url)
        if (!err) {
          matched.url = `${URL}${this.form.path}${addition}`
        } else {
          matched.thumb = `/static/img/fail.png`
          matched.url = `/static/img/fail.png`
        }
      })
    },
    deletePic(idx, event) {
      this.list[idx].images.splice(event.index, 1)
    },

    async confirm() {
      console.log(this.list)
      debugger
      const data = {
        orderId: this.id,
        list: this.list.map((item) => {
          return {
            itemSkuId: item.itemId,
            itemSpuId: item.itemSpuId,
            title: item.title || '',
            content: item.content || '未填写评价',
            score: item.rating,
            images: item.images.map((c) => c.url),
            nickname: store.state.user.logged.nickname,
            avatar: store.state.user.logged.avatar,
          }
        }),
      }
      await comment(data)
      this.$goto(-1)
    },
  },
}
</script>

<style>
page {
  background-color: #f7f7f7;
}
</style>
<style scoped lang="scss">
.app {
  padding: 20rpx;
}
.list {
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
    border-radius: 12rpx 12rpx 0 0;
  }
}
.star-wrap {
  padding: 30rpx 24rpx 10rpx;

  .tit {
    font-size: 30rpx;
    color: #333;
    font-weight: 700;
  }
  .title {
    width: 400rpx;
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #666;
  }
  .icon-iconfontxingxing {
    margin-right: 6rpx;
    font-size: 36rpx;
    color: #ccc;

    &.active {
      color: #f0a80e;
    }
  }
}
.textarea-wrap {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

  textarea {
    width: 100%;
    height: 200rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    background-color: #f7f7f7;
    border-radius: 12rpx;
  }
}
.upload-wrap {
  padding: 10rpx 0 10rpx 20rpx;

  // /deep/ {
  // 	.upload-content{
  // 		background-color: #fff;
  // 	}
  // 	.upload-item{
  // 		width: 144rpx;
  // 		height: 144rpx;
  // 	}
  // 	.upload-add-btn{
  // 		width: 144rpx;
  // 		height: 144rpx;
  // 	}
  // }
}
.btn-wrap {
  padding: 60rpx;
  background-color: #fff;
  border-radius: 0 0 12rpx 12rpx;
}
</style>
