<template>
  <div v-if="show">
    <div class="py-16 text-center text-bold">
      选择预计上门时间
    </div>
    <div class="px-32 py-16 text-gray text-sm"> 上门时间仅供派单参考，具体时间以客服确认为准。想立即预约上门，请联系客服。 </div>
    <div class="bg-white flex dialog text-base bt-1">
      <scroll-view scroll-y scroll-with-animation class="left text-center flex-grow dialog">
        <div v-for="(c, idx) in list" :key="c.title" :class="{ active: current == idx }" class="py-32" @click="current = idx">
          {{ c.title }}
        </div>
      </scroll-view>
      <scroll-view scroll-y scroll-with-animation class="right bg-white flex-grow dialog">
        <button class="u-reset-button" open-type="contact" show-message-card>
          <div v-if="current == 0" class="py-28 bb-1 mx-32 text-left">
            立即上门（请联系客服）
          </div>
        </button>
        <div
          v-for="(c, idx) in list[current].children"
          :key="c.title"
          class="py-20 bb-1 mx-32"
          :class="{ disabled: c.type == 0 }"
          @click="confirm(idx)"
        >
          {{ c.title }}
          <span v-if="c.type == 0" class="text-gray"> （约满） </span>
          <span v-if="c.type == 2" class="text-gray"> （加价） </span>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import pick from '@/pages/order/comp/time-picker'
var list = pick.getNextDays(7, 8, 20, 4, 22, 21)
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list,
      current: 0,
    }
  },
  methods: {
    confirm(idx) {
      var { list, current } = { ...this }
      var item = list[current].children[idx]
      if (item.type) {
        var title = list[current].title + item.title
        this.$emit('input', title)
        this.$emit('update:show', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  height: 40vh;
}
.left {
  width: 280rpx;
  background: #f0f0f0;
  .active {
    background: #ffffff;
  }
}
.right {
  width: 470rpx;
  .disabled {
    color: #9b9b9b;
    text-decoration: line-through;
  }
}
</style>
