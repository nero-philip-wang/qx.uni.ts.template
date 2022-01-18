<template>
  <div class="mx-32 my-24 bg-white" :class="{ disabled: navCurrent !== 0 }">
    <!-- 上半 -->
    <div class="pt-16 pb-8 px-40 flex align-center">
      <div class="left pt-8">
        <div class="text-lg truncate">{{ item.title }} </div>
        <div class="text-gray text-sm mt-16">{{ item.startTime | datef }} - {{ item.endTime | datef }} </div>
      </div>
      <div class="right text-center">
        <div class="text-price">
          <span v-if="item.minus">{{ item.minus | yuan }}元</span>
          <span v-else-if="item.discount == 0">
            免费
          </span>
          <span v-else>
            {{ (item.discount * 10).toFixed(1).endsWith('.0') ? (item.discount * 10).toFixed(0) : (item.discount * 10).toFixed(1) }} 折
          </span>
        </div>
        <div class="text-gray text-sm mt-16">
          <span v-if="item.quantityCondition">满{{ item.quantityCondition }}件可用</span>
          <span v-else>满{{ item.amountCondition || 0 | yuan }}元可用</span>
        </div>
      </div>
      <div v-if="checkable" class="pt-32 pl-20">
        <u-checkbox-group v-model="isChecked" shape="circle">
          <u-checkbox shape="circle" :name="0" />
        </u-checkbox-group>
      </div>
    </div>
    <!-- 分隔 -->
    <div class="divider flex">
      <div class="rounded hole"></div>
      <div class="flex-grow border"></div>
      <div class="rounded hole"></div>
    </div>
    <!-- 下半 -->
    <div class="px-40 pt-4 pb-16 flex">
      <div class="text-gray desc" @click="trigger(item)">
        <div class="flex text-base">
          <span class="mr-16">使用说明</span>
          <u-icon name="arrow-down" size="28rpx"></u-icon>
        </div>
        <div v-show="item.image" class="text-sm mt-16">
          {{ item.description || '无' }}
        </div>
      </div>

      <div v-if="item.isAllItems" class="text-gray text-base">全场商品可用</div>
      <div v-else class="text-gray text-base">部分商品可用</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      require: true,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    isChecked: {
      get() {
        return this.checked ? [0] : []
      },
      set(v) {
        this.$emit('update:checked', !!v.length)
      },
    },
  },
  methods: {
    trigger(item) {
      item.image = !item.image
    },
  },
}
</script>

<style lang="scss" scoped>
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
