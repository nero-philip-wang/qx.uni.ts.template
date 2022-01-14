<template>
  <div class="m-24 bg-white rounded p-32">
    <div class="title flex">
      <span class="text-base bolder flex-grow">{{ title }}</span>
      <span class="text-sm text-gray" @click="$goto(moreHref)">{{ more }}</span>
    </div>

    <div class="flex mt-40 text-center">
      <template v-for="c in items">
        <div :key="c.title" class="flex-grow" @click="c.href && $goto(c.href)">
          <!-- 数值或图片 -->
          <div v-if="c.icon" class="text-xl text-primary mb-16 relative w-52 block-center">
            <u-badge type="primary" absolute :offset="[-10, -15]" :value="c.badge"></u-badge>
            <div v-if="c.icon && c.icon.includes('qx-')" class="qxfont w-52 h-52 text-icon" :class="c.icon"></div>
            <image v-else mode="aspectFill" class="w-52 h-52" :src="c.icon" />
          </div>
          <div v-else class="text-xl text-primary mb-16 bolder">{{ c.value || 0 }}</div>
          <!-- 项目名称 -->
          <div class="text-sm text-black-38">{{ c.title }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    more: {
      type: String,
      default: '',
    },
    moreHref: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      itemsType: {
        title: '',
        value: '',
        badge: '',
        icon: '',
        href: '',
      },
    }
  },
}
</script>
<style scoped>
.text-icon {
  font-size: 48rpx;
}
</style>
