<template>
  <div class="flex px-32 py-16 place-items-center bg-white" style="z-index:100" @click="$goto('/pages/item/detail?id=' + value.id)">
    <!-- 勾选 -->
    <div v-if="showCheckbox" class="flex place-items-center pr-16" :style="{ height }" @click="checkedTriggle">
      <u-checkbox-group v-model="checkedValue" @change="checkedTriggle">
        <u-checkbox shape="circle"> </u-checkbox>
      </u-checkbox-group>
    </div>
    <!-- 图片 -->
    <div class="rounded-sm overflow-hidden">
      <u--image show-loading :src="value.cover | thumbnail" :width="height" :height="height"></u--image>
    </div>
    <!-- 右侧文本 -->
    <div class="flex-grow flex-col ml-16" :style="{ height }">
      <!-- 标题 -->
      <u--text :lines="2" :text="value.title" bold size="28rpx" line-height="44rpx"></u--text>
      <!-- 规格 -->
      <div class="text-sm flex-grow">
        <span v-if="!isItem">默认规格</span>
      </div>
      <!-- 价格数量 -->
      <div class="flex lineh-full mb-8">
        <span class="text-sm text-price ml-8"> ¥</span>
        <span class="text-lg text-price ml-4">{{ value.minRetailPrice | yuan }}</span>
        <span class="flex-grow"></span>
        <u-number-box v-if="editable" v-model="value.quantity" button-size="42rpx"></u-number-box>
        <span v-else-if="!isItem"> {{ value.quantity }}</span>
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
      return this.small ? '160rpx' : '200rpx'
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
  },
}
</script>
<style scoped>
.itemheight {
  height: 200rpx;
}
</style>
