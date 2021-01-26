<template>
  <web-view :src.sync="src" @message="onMessage"></web-view>
</template>

<script>
// import share from '../../utils/share'
export default {
  data() {
    return {
      src: null,
      title: '',
    }
  },
  watch: {
    src(value) {},
  },
  methods: {
    message(event) {},
  },
  onLoad(options) {
    this.src = decodeURIComponent(options.src)
    this.title = options.title
    uni.setNavigationBarTitle({
      title: options.title,
    })
  },
  onShareAppMessage: function(ops) {
    // const path = share.getNativeShare('/pagesA/webview/index?src=' + encodeURIComponent(this.src) + '&title=' + this.title)
    // console.log('path', path)
    // if (ops.from === 'button') {
    // // 来自页面内转发按钮
    // console.log(ops.target)
    // }
    // return {
    //     title: this.title,
    //     path: path, // 点击分享消息是打开的页面
    //     imageUrl:''
    // }
  },
}
</script>
