<template>
  <div class="mx-32 my-16 rounded-sm py-16 px-16 bg-white">
    <div class="flex text-base">
      <span class="flex-grow qxfont text-base">&#xe61e; 夏至</span>
      <span class="text-primary">状态</span>
    </div>
    <div class="flex place-items-center bb-1 py-16 text-base text-center">
      <scroll-view scroll-x style="max-width:calc(100% - 360rpx);">
        <div :style="{ width: 8 * 80 + 'rpx' }">
          <image
            v-for="i in 8"
            :key="i"
            src="https://cdn.uviewui.com/uview/album/1.jpg"
            class="mr-8 rounded-sm"
            style="width:72rpx;height:72rpx;"
          ></image>
        </div>
      </scroll-view>
      <div class="ml-4 flex-grow text-gray text-sm text-left">等32件</div>
      <div class="ml-12">
        <div>订单总额</div>
        <div class="text-price">￥5454</div>
      </div>
      <div class="ml-12">
        <div>预计收入</div>
        <div class="text-price">￥54</div>
      </div>
    </div>
    <div class="flex text-xs text-gray">
      <span class="flex-grow">2022-5-25 17:18:07创建</span>
      <span>订单号:516151651615165161516</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
