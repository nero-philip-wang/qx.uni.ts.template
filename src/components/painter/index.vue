<template>
  <view :style="'width: ' + board.width + ';height: ' + board.height">
    <image v-if="hascreated" :src="src" class="fill" show-menu-by-longpress />
    <qx-lime-painter
      v-if="!hascreated && board && board.views"
      :style="board"
      :board="board"
      is-render-image
      type="webgl"
      :sleep="80"
      @success="success"
    />
  </view>
</template>
<script>
export default {
  props: {
    board: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      hascreated: false,
      src: '',
    }
  },
  watch: {
    board() {
      this.hascreated = false
    },
  },
  methods: {
    success(src) {
      setTimeout(() => {
        this.src = src
        this.hascreated = true
      }, 100)
    },
  },
}
</script>
