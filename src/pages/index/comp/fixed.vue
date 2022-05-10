<template>
  <div class="fixed">
    <div
      v-for="(item, index) in params.list"
      :key="index"
      class="mb-24 overflow-hidden"
      :class="{ 'lineh-0': !item.title }"
      @click="$goto(item.href)"
    >
      <button v-if="item.href == 'kf'" class="u-reset-button" open-type="contact" send-message-title="首页" show-message-card>
        <image
          class="image rounded"
          mode="aspectFill"
          :src="item.src"
          :style="{ height: autoAddUnit(params.height), width: autoAddUnit(params.height) }"
        ></image>
      </button>
      <image
        v-else
        class="image rounded"
        mode="aspectFill"
        :src="item.src"
        :style="{ height: autoAddUnit(params.height), width: autoAddUnit(params.height) }"
      ></image>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    autoAddUnit(height) {
      if (!height) height = '96'
      return isNaN(parseInt(height)) ? height : height + 'rpx'
    },
  },
}
</script>

<style scoped>
.fixed {
  position: fixed;
  right: 32rpx;
  bottom: 256rpx;
}
</style>
