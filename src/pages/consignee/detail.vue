<template>
  <div class="p-32">
    <u--form label-width="120rpx" label-position="left" :model="data">
      <u-form-item label="收货人" border-bottom>
        <u--input v-model="data.name" border="none"></u--input>
      </u-form-item>
      <u-form-item label="手机号" border-bottom>
        <u--input v-model="data.mobile" border="none"></u--input>
      </u-form-item>
      <u-form-item label="地址" border-bottom @click="chooseAddress">
        <div :class="{ textGray: !address.addr }">
          {{ address.addr ? address.addr : '请在地图选择收货地址' }}
        </div>
      </u-form-item>
      <u-form-item label="门牌号" border-bottom>
        <u--input v-model="address.room" border="none"></u--input>
      </u-form-item>
    </u--form>

    <div class="fixed">
      <u-button shape="circle" @click="submit">
        提交
      </u-button>
    </div>

    <!-- <div class="cell row b-b">
      <span class="tit fill">设为默认地址</span>
      <switch :checked="data.isDefault" color="#FF536F" @change="onSwitchChange" />
    </div> -->
  </div>
</template>

<script>
import { get, create, update } from '@/apis/modules/consignee'
import file from './pca-code.json'

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
      uni.navigateBack()
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
          console.log(res)
          this.data.position = { x: res.longitude, y: res.latitude }
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
          var node = file
          var pca = this.address.pca.split(' ')
          for (let i = 0; i < 3; i++) {
            if (i < 2) node = node.filter((c) => c.name == pca[i])[0].children
            else node = node.filter((c) => c.name == pca[i])[0].code
          }
          this.data.postCode = node
        },
      })
    },
    // 选择地址回调
    setAddress(e) {
      console.log(JSON.stringify(e))
      this.data.address = e
    },
    onSwitchChange(e) {
      this.data.isDefault = e.detail.value
    },
  },
}
</script>

<style scoped>
.fixed {
  bottom: 50rpx;
  left: 100rpx;
  right: 100rpx;
}
/deep/ .u-line {
  border-color: #ddd;
}
</style>
