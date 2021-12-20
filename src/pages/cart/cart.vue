<template>
  <div class="flex-col h-page">
    <div class="bg-white">
      <u-cell :title="`全部商品 (${total})`" :title-style="{ fontSize: '28rpx' }">
        <u--text slot="right-icon" text="编辑" size="28rpx"></u--text>
      </u-cell>
    </div>
    <scroll-view scroll-y scroll-with-animation class="scroll flex-grow overflow-scroll py-16" @scrolltolower="upCallback">
      <div v-for="(i, idx) in items" :key="i.itemId" :index="idx" :name="idx" :options="[{ text: '删除' }]">
        <CartItem show-checkbox editable :checked.sync="i.checked"> </CartItem>
      </div>
      <div v-if="loading" class="text-center mt-8">
        <u-loading-icon></u-loading-icon>
      </div>
    </scroll-view>
    <!-- 结算栏 -->
    <div class="checkoutbar bg-white">
      <u-cell>
        <div slot="icon">
          <u-checkbox-group v-model="checked">
            <u-checkbox shape="circle" label="全选"></u-checkbox>
          </u-checkbox-group>
        </div>
        <div slot="title" class="h-full lineh-full ml-16">
          <span class="text-base bolder ">合计 </span>
          <span class="text-sm text-price ml-8"> ¥</span>
          <span class="text-lg text-price ml-4">{{ itemAmount | yuan }}</span>
        </div>
        <u-button slot="right-icon" type="primary" :custom-style="{ height: '72rpx', borderRadius: '0' }">去结算</u-button>
      </u-cell>
    </div>
    <qx-tabbar v-if="showTabbar" :value="2" />
  </div>
</template>
<script>
import CartItem from './comp/cartItem.vue'
import Enumerable from 'linq'

export default {
  components: {
    CartItem,
  },
  props: {
    showTabbar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      total: 250,
      textPriceColor: '#ca0007',
      items: [
        { checked: true, itemId: 1, price: 12939 },
        { checked: false, itemId: 2 },
        { checked: false, itemId: 3 },
        { checked: false, itemId: 4 },
        { checked: false, itemId: 5 },
        { checked: false, itemId: 6 },
        { checked: false, itemId: 7 },
        { checked: false, itemId: 8 },
        { checked: false, itemId: 9 },
        { checked: true, itemId: 10, price: 139 },
      ],
      loading: 1, // 1 加载中 0 没有更多
    }
  },
  computed: {
    checked: {
      get() {
        return Enumerable.from(this.items).all((c) => c.checked) ? [''] : []
      },
      set(v) {
        this.items.forEach((c) => {
          c.checked = !!v.length
        })
      },
    },
    itemAmount() {
      return Enumerable.from(this.items)
        .where((c) => c.checked)
        .sum((c) => c.price || 0)
    },
  },
  methods: {
    upCallback(page) {
      setTimeout(() => {
        this.loading = 0
      }, 300)
    },
  },
}
</script>
