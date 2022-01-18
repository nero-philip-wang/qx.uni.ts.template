<template>
  <div class="main flex px-16 py-16 place-items-center bg-white">
    <!-- 勾选 -->
    <div v-if="showCheckbox" class="flex place-items-center px-16" :style="{ height }" @click="checkedTriggle">
      <u-checkbox-group v-model="checkedValue" @change="checkedTriggle">
        <u-checkbox shape="circle"> </u-checkbox>
      </u-checkbox-group>
    </div>
    <!-- 图片 -->
    <div class="rounded-sm overflow-hidden" :style="{ minWidth: height }" @click="clickItem">
      <u--image show-loading :src="value.cover | thumbnail" :width="height" :height="height"></u--image>
    </div>
    <!-- 右侧文本 -->
    <div
      class="flex-grow flex-col justify-between ml-16"
      :style="{ height, width: `calc(100% - ${height} - ${showCheckbox ? '80rpx' : '0rpx'})` }"
      @click="clickItem"
    >
      <!-- 标题 -->
      <span class="text-base text-blank-1b" :class="small ? 'u-line-1' : 'u-line-2'">{{ value.title }}</span>
      <!-- 规格 -->
      <div class="text-sm text-gray">
        <span v-if="!isItem" class="u-line-1">默认规格</span>
        <span v-else class="u-line-2 text-xs"> {{ value.description || '' }} </span>
      </div>
      <!-- 价格数量 -->
      <div class="flex lineh-full mt-8">
        <span class="text-sm text-price text-bold ml-8"> ¥</span>
        <span class="text-lg text-price text-bold ml-4">{{ value.minRetailPrice | yuan }}</span>
        <span class="flex-grow"></span>
        <div v-if="editable" class="b-1 rounded-sm overflow-hidden" @click.stop.prevent>
          <u-number-box v-model="value.quantity" button-size="48rpx" bg-color="#fff">
            <div slot="minus" class="minus br-1 p-8">
              <u-icon name="minus" size="32rpx"></u-icon>
            </div>
            <div slot="plus" class="plus bl-1 p-8">
              <u-icon name="plus" size="32rpx"></u-icon>
            </div>
          </u-number-box>
        </div>
        <span v-else-if="!isItem"> x {{ value.quantity }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    isItem: {
      type: Boolean,
      default: false,
    },
    disabledLink: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({
        title: '热销商品热销商品热销商品热销商品',
        cover: 'https://cdn.uviewui.com/uview/album/1.jpg',
        quantity: 1,
        price: 256623,
      }),
    },
  },
  data() {
    return {
      checkedValue: [],
    }
  },
  computed: {
    height() {
      return this.small ? '160rpx' : '175rpx'
    },
    id() {
      return this.value.id || this.value.itemId
    },
  },
  watch: {
    checked: {
      immediate: true,
      handler() {
        this.checkedValue = this.checked ? [''] : []
      },
    },
  },
  methods: {
    checkedTriggle() {
      this.$emit('update:checked', !this.checked)
    },
    clickItem() {
      if (this.disabledLink) return
      this.$goto('/pages/item/detail?id=' + this.id)
    },
  },
}
</script>
<style scoped>
.main {
  width: 100%;
}
.itemheight {
  height: 200rpx;
}
</style>
