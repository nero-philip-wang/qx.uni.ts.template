<template>
  <u-cell icon="share" title="隐藏分享人" label="隐藏后分享就不会携带当前分享人信息">
    <u-switch slot="right-icon" v-model="checked" @change="change"></u-switch>
  </u-cell>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
    }
  },
  methods: {
    change(v) {
      uni.setStorageSync('hidden/share', v)
    },
  },
  onLoad() {
    this.checked = !!uni.getStorageSync('hidden/share')
  },
}
</script>

<style></style>
