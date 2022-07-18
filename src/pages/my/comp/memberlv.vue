<template>
  <div>
    <slot v-if="list && list.length" :discount="minDiscount"></slot>
    <u-popup :show="show" mode="bottom" round="15rpx" @close="$emit('update:show', false)">
      <div class="z-100 px-32 py-48">
        <div v-for="c in list" :key="c.id" class="flex align-center mb-32">
          <u-avatar :src="c.icon"></u-avatar>
          <div class="ml-12">
            <div class=" text-base">{{ c.title }}</div>
            <div class="text-sm text-gray"> {{ c.description }}</div>
          </div>
        </div>

        <u-button v-if="list && list.length" type="primary" plain :custom-style="{ height: '72rpx', borderRadius: '0' }" @click="buy">
          充值送会员
        </u-button>
        <u-empty v-else icon="http://cdn.uviewui.com/uview/empty/search.png" text="暂无会员活动"> </u-empty>
      </div>
    </u-popup>
  </div>
</template>

<script>
import { listMemberLevel } from '@/apis/modules/home'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
    }
  },
  computed: {
    minDiscount() {
      var dis = 1
      if (this.list && this.list.length) this.list.forEach((c) => (dis = Math.min(dis, c.discount)))

      if (isNaN(dis)) dis = 10
      else dis = (dis * 10).toFixed(1)
      return dis
    },
  },
  async created() {
    this.list = await listMemberLevel()
  },
  methods: {
    buy() {
      this.$emit('update:show', false)
      this.$goto('/pages/my/balance')
    },
  },
}
</script>

<style></style>
