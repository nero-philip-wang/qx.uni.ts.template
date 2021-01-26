<template>
  <qx-painter :board="painter" />
</template>
<script>
const def = {
  left: '0',
  top: '0',
  width: '200rpx',
  height: '200rpx',
}
export default {
  props: {
    text: { type: String, default: '-' },
    options: {
      type: Object,
      default: () => def,
    },
  },
  computed: {
    myOption() {
      return Object.assign({}, def, this.options)
    },
    painter() {
      return {
        width: this.myOption.width,
        height: this.myOption.height,
        views: [
          {
            type: 'qrcode',
            text: this.text,
            css: this.myOption,
          },
        ],
      }
    },
  },
}
</script>
