<template>
  <u-popup :show="show" mode="bottom" bg-color="transparent" close-on-click-overlay @close="showSwitch(false)">
    <div @click="showSwitch(false)">
      <div :style="{ width: board.width, height: board.height || '700rpx', margin: '0 auto' }" @click.stop.prevent>
        <qx-painter v-if="board" :board="board" @success="setSrc" />
      </div>
      <div class="mt-80 py-32 bg-white" @click.stop.prevent>
        <u-grid :border="false" col="2">
          <u-grid-item>
            <button class="u-reset-button flex flex-col place-items-center" open-type="share">
              <u-icon name="weixin-fill" size="80rpx" color="#07B906"></u-icon>
              <text class="text-base">{{ '分享到聊天' }}</text>
            </button>
          </u-grid-item>

          <u-grid-item @click="saveMedia">
            <u-icon name="moments-circel-fill" size="80rpx" color="#07B906"></u-icon>
            <text class="text-base">{{ '保存图文' }}</text>
          </u-grid-item>
        </u-grid>
      </div>
    </div>
  </u-popup>
</template>

<script>
import getPoster from './getPoster'
import { toYuan } from '@/utils/index'
import stools from '@/utils/appLaunch/share'
import app from '@/config/index'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    spu: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      src: null,
      board: null,
    }
  },
  watch: {
    async show(value) {
      if (value) {
        this.board = await getPoster({
          title: this.spu.title,
          cover: this.spu.cover,
          price: toYuan(this.spu.minRetailPrice),
          mPrice: toYuan(this.spu.markingPrice),
          qr: stools.methods.wxaCodeUrl(),
        })
      }
    },
  },
  methods: {
    showSwitch(on = false) {
      this.$emit('update:show', on)
    },
    setSrc(src) {
      this.src = src
    },
    saveMedia() {
      uni.setClipboardData({
        data: this.spu.title,
      })
      uni.saveImageToPhotosAlbum({
        filePath: this.src,
      })
    },
  },
}
</script>

<style></style>
