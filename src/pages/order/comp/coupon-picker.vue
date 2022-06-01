<template>
  <div v-if="show" class="bg-f0">
    <div class="py-16 text-center text-bold">
      选择优惠券
    </div>
    <scroll-view scroll-y class="dialog">
      <coupon v-for="(item, index) in selected" :key="index" :item="item" checkable :checked.sync="item.checked" @update:checked="change">
      </coupon>
      <coupon
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        checkable
        :checked.sync="list[index].checked"
        @update:checked="change"
      >
      </coupon>
    </scroll-view>
  </div>
</template>

<script>
import coupon from '@/pages/my/comp/coupon-card.vue'

export default {
  components: { coupon },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selected: [],
    }
  },
  computed: {
    list() {
      if (this.data && this.data.length) {
        var result = [...this.data]
        result.forEach((element) => {
          element.checked = false
        })
        return result.filter((c) => !c.checked)
      } else return []
    },
  },
  methods: {
    change() {
      this.selected = [...this.selected, ...this.data].filter((c) => c.checked)

      this.$emit(
        'input',
        this.selected.map((c) => c.id)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  min-height: 40vh;
  max-height: 60vh;
}
.left {
  width: 450rpx;
}
.right {
  width: 220rpx;
}
.text-price {
  font-size: 48rpx;
}
.hole {
  background-color: #f5f5f5;
  height: 20rpx;
  width: 20rpx;
  margin-left: -6rpx;
  margin-right: -6rpx;
}
.border {
  border-bottom: 1px dashed #e5e5e5;
  margin-bottom: 10rpx;
  margin-left: 6rpx;
}
.desc {
  width: 425rpx;
}
</style>
