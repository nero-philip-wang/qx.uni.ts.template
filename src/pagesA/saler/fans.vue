<template>
  <div class="bg-white p-32">
    <div v-for="i in 12" :key="i" class="flex place-items-center mb-32">
      <image src="https://cdn.uviewui.com/uview/album/1.jpg" class="mr-8 rounded-full" style="width:100rpx;height:100rpx;"></image>
      <div class="flex-grow text-base ml-16">
        <div class="ml-8">JMIN</div>
        <div>179****7645</div>
      </div>
      <div class="pr-8 text-sm">
        2019.12.20 加入
      </div>
      <u-tag text="未消费" plain size="mini" shape="circle" type="info"></u-tag>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
