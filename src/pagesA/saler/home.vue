<template>
  <div>
    <button class="u-reset-button" open-type="contact">
      <image
        src="https://i-1-lanrentuku.52tup.com/2020/12/4/3ca4119d-ff5d-4d4f-9ad6-8bb036ef8229.png?imageView2/2/w/1024/"
        class="w-full"
        mode="widthFix"
      ></image>
    </button>
  </div>
</template>

<script>
export default {
  created() {
    setTimeout(() => {
      this.$goto('/pagesA/saler/index')
    }, 200)
  },
}
</script>

<style></style>
