<template>
  <page-container ref="popup" :show="show" position="bottom" @afterleave="$emit('update:show', false)">
    <div class="bg-white">
      <!-- 头部反馈区 -->
      <div class="flex mx-32 mt-32 mb-16">
        <image class="pic" :src="currentSku.cover || infoData.covers[0]" mode="aspectFill"></image>
        <div class="ml-20">
          <div class="mb-20 text-bold text-lg text-price">￥{{ currentSku.retailPrice || infoData.minRetailPrice | yuan }}</div>
          <div class="mb-20 text-gray text-sm">库存：{{ currentSku.stock || infoData.stock || '-' }}</div>
          <div v-if="infoData.skus.length > 0" class="attr-wrap row">
            <span class="text-sm">规格：{{ attrStringify(currentSku.spuAttr) || '' }}</span>
          </div>
        </div>
      </div>
      <scroll-div class="c-wrap" scroll-y="true">
        <!-- 规格选择 -->
        <!-- <div class="sku-list fill"> -->
        <div v-for="(item, index) in spu.specifications" :key="index" class="flex align-center">
          <div class="ml-40 py-16 text-black-1b text-base text-bold">{{ item.title }}</div>
          <!-- 规格值 -->
          <div class="flex ml-32">
            <div
              v-for="(aItem, aIndex) in item.values"
              :key="aIndex"
              class="attr rounded-full text-center text-primary"
              :class="{ active: aItem.checked, disabled: aItem.disabled }"
              @click="chooseAttr(aItem, item)"
            >
              <span>{{ aItem.title }}</span>
            </div>
          </div>
        </div>
        <div class="flex align-center pr-32">
          <div class="ml-40 py-16 text-black-1b text-base text-bold">数量</div>
          <div class="flex-grow"></div>
          <u-number-box v-model="buyNumber" :min="1" :max="currentSku.stock || 999"></u-number-box>
        </div>
      </scroll-div>
      <!-- 确认区域 -->
      <div class="pr-16 py-32">
        <div v-if="type === 'cart' || type === 'buy'" class="pl-32 pr-16 flex">
          <div class="flex-grow"></div>
          <div class="btn">
            <u-button type="primary" text="确认" @click="confirm(type)"></u-button>
          </div>
        </div>

        <div v-else class="pl-32 pr-16 flex">
          <div class="flex-grow"></div>
          <div class="pr-24 btn">
            <u-button plain type="primary" text="加入购物车" @click="confirm('cart')"></u-button>
          </div>
          <div class="btn">
            <u-button type="primary" text="立即购买" @click="confirm('buy')"></u-button>
          </div>
        </div>
      </div>
    </div>
  </page-container>
</template>

<script>
export default {
  props: {
    infoData: {
      type: Object,
      default() {
        return {}
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: '', // cart加入购物车 buy立即购买
      buyNumber: 1,
      spu: {},
      currentSku: {},
    }
  },
  watch: {
    buyNumber(value) {
      this.$emit('update:quantity', value)
    },
    infoData: {
      immediate: true,
      handler(v) {
        v.specifications.forEach((c) => (c.values[0].checked = true))
        this.spu = Object.assign({}, { ...v })
        this.renderChecked()
      },
    },
  },
  methods: {
    // 显示当前的规格
    attrStringify(attr) {
      var s = ''
      for (const key in attr) {
        s += `${attr[key]} `
      }
      return s
    },
    // 结算
    confirm(type) {
      this.$emit(type === 'cart' ? 'addToCart' : 'buyNow', { ...(this.currentSku || this.spu.skus[0]), quantity: this.buyNumber || 1 })
    },
    // 选择规格值
    chooseAttr(item, parent) {
      if (item.checked) {
        return
      }
      parent.values.forEach((attr) => {
        if (attr.title !== item.title) {
          attr.checked = false
        }
      })
      item.checked = true
      this.renderChecked()
    },
    // 处理选中值
    renderChecked() {
      // const { specList, skuList, buyNumber } = this
      var selectAttr = {}
      this.spu.specifications.forEach((item) => {
        var key = item.title
        var selectItem = item.values.filter((attr) => attr.checked)[0]
        selectAttr[key] = selectItem ? selectItem.title : ''
      })
      var selectSku = this.spu.skus.filter((item) => {
        return JSON.stringify(item.spuAttr) == JSON.stringify(selectAttr)
      })[0]
      if (selectSku) {
        this.currentSku = selectSku
      }
    },
  },
}
</script>

<style scoped lang="scss">
.pic {
  flex-shrink: 0;
  width: 160rpx;
  height: 160rpx;
  margin-right: 20rpx;
  background-color: #f7f7f7;
  border-radius: 10rpx;
}

.attr {
  min-width: 58rpx;
  height: 58rpx;
  line-height: 58rpx;
  padding: 0 24rpx;
  margin-right: 20rpx;
  font-size: 26rpx;
  color: #333;

  &:after {
    border-color: #e0e0e0;
  }
  &.active {
    color: $base-color;
    background-color: rgba($base-color, 0.03);

    &:after {
      border-color: rgba($base-color, 0.5);
    }
  }
  &.disabled {
    background-color: #ddd;
  }
}

.btn {
  width: 200rpx;
}
</style>
