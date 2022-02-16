<template>
  <view class="u-demo-block__content mb-16">
    <view class="album">
      <view class="album__avatar">
        <image :src="data.avatar" mode="" style="width: 64rpx;height: 64rpx;"></image>
      </view>
      <view class="album__content">
        <u--text mode="name" :text="data.nickname" type="primary" bold size="17" format="encrypt"></u--text>
        <u--text margin="0 0 8px 0" :text="data.content"></u--text>
        <u-album
          v-if="data.images && data.images.length"
          :urls="data.images"
          :max-count="3"
          :row-count="3"
          single-size="70"
          multiple-size="70"
          single-mode="aspectFill"
        ></u-album>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
.album {
  @include flex;
  align-items: flex-start;

  &__avatar {
    background-color: $u-bg-color;
    padding: 5px;
    border-radius: 3px;
  }

  &__content {
    margin-left: 10px;
    flex: 1;
  }
}
</style>
