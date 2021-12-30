<template>
  <div class="p-32">
    <u--form ref="form" label-width="120rpx" label-position="left" :model="data" :rules="rules">
      <u-form-item label="收货人" border-bottom prop="name">
        <u--input v-model="data.name" border="none"></u--input>
      </u-form-item>
      <u-form-item label="手机号" border-bottom prop="mobile">
        <u--input v-model="data.mobile" border="none"></u--input>
      </u-form-item>
      <u-form-item label="地址" border-bottom prop="address" @click="chooseAddress">
        <u--textarea
          v-model="data.address"
          :focus="focus"
          border="none"
          placeholder="请在地图选择收货地址"
          :disabled="!focus"
          auto-height
        ></u--textarea>
      </u-form-item>
      <u-form-item label="门牌号" border-bottom prop="room">
        <u--input v-model="data.room" border="none"></u--input>
      </u-form-item>
    </u--form>

    <div class="px-32 py-24">
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

var rules = {
  name: {
    type: 'string',
    required: true,
    message: '请输入收货人姓名',
    trigger: ['blur', 'change'],
  },
  mobile: {
    type: 'string',
    required: true,
    validator: (rule, value, callback) => {
      return uni.$u.test.mobile(value)
    },
    message: '请输入收货人正确的手机号码',
    trigger: ['blur', 'change'],
  },
  address: {
    type: 'string',
    required: true,
    min: 12,
    message: '请选择详细地址',
    trigger: ['blur', 'change'],
  },
  room: {
    type: 'string',
    required: true,
    message: '请输入门牌号',
    trigger: ['blur', 'change'],
  },
}
export default {
  data() {
    return {
      id: null,
      focus: false,
      data: {
        name: '',
        mobile: '',
        address: '',
        room: '',
      },
      rules,
    }
  },
  computed: {},
  async onLoad(options) {
    this.$refs.form.setRules(rules)
    this.id = options.id
    if (this.id) {
      this.data = await get(options.id)
    }
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate()
        if (this.id) {
          await update(this.data)
        } else {
          await create(this.data)
        }
        uni.navigateBack()
      } catch (error) {
        uni.showToast({ title: '请填写表单信息', icon: 'error' })
      }
    },
    // 选择地址
    chooseAddress() {
      uni.chooseLocation({
        success: (res) => {
          const p = ['省', '区', '市', '州', '县', '旗', '盟']
          p.forEach((element) => {
            res.address = res.address.replace(new RegExp(`(${element})`, 'g'), '$1 ')
          })

          try {
            var node = file
            var pca = res.address.split(' ')
            for (let i = 0; i < 3; i++) {
              if (i < 2) node = node.filter((c) => c.name == pca[i])[0].children
              else node = node.filter((c) => c.name == pca[i])[0].code
            }
            this.data.postCode = node
            this.data.position = { x: res.longitude, y: res.latitude }
            this.data.address = `${res.address} ${res.name}`
          } catch (error) {
            this.data.address = ' '
          }
        },
      })
    },
  },
}
</script>

<style scoped>
/deep/ .u-line {
  border-color: #ddd;
}
</style>
