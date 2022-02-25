<template>
  <div class="flex-col h-page">
    <div class="bg-white">
      <u-cell :title="`全部商品 (${total})`" :title-style="{ fontSize: '28rpx' }"> </u-cell>
    </div>
    <div class="scroll flex-grow overflow-scroll py-16">
      <listview v-model="items" loadmore-enabled :request="search" height="100%" :argvs="argvs">
        <u-swipe-action>
          <div v-for="(i, idx) in items" :key="i.itemId" :index="idx" :name="idx" :options="[{ text: '删除' }]">
            <u-swipe-action-item :options="[{ text: '删除' }]" @click="del(i, idx)">
              <CartItem
                show-checkbox
                editable
                :checked.sync="i.checked"
                :value="i"
                :quantity.sync="i.quantity"
                @update:quantity="update(i)"
              >
              </CartItem>
            </u-swipe-action-item>
          </div>
        </u-swipe-action>
      </listview>
    </div>
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
        <u-button slot="right-icon" type="primary" :custom-style="{ height: '72rpx', borderRadius: '0' }" @click="buy">去结算</u-button>
      </u-cell>
    </div>
    <qx-tabbar v-if="showTabbar" :value="2" />
  </div>
</template>
<script>
import CartItem from './comp/cartItem.vue'
import Enumerable from 'linq'
import { get, updateQuantity, del, count } from '@/apis/modules/cart'
import listview from '@/components/listview'
import state from '@/store/easyState'

export default {
  components: {
    CartItem,
    listview,
  },
  props: {
    showTabbar: {
      type: Boolean,
      default: false,
    },
    refresh: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      total: 0,
      items: [],
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
        .sum((c) => (c.price || 0) * c.quantity)
    },
    argvs() {
      return { refresh: this.refresh }
    },
  },
  async created() {
    await count()
    this.total = state.cartCount
  },
  methods: {
    async search({ take, skip }) {
      var list = await get(skip, take)
      list = list.map((c) => ({ ...c, checked: false, key: c.id, id: c.itemSpuId }))
      return list
    },
    update(item) {
      this.$u.debounce(async () => {
        await updateQuantity(item.key, item.quantity)
        this.total = state.cartCount
      }, 500)
    },
    async del(item, idx) {
      try {
        await del(item.key)
        this.total = state.cartCount

        uni.showToast({ title: '已删除', icon: 'success' })
        this.items.splice(idx, 1)
      } catch (error) {
        uni.showToast({ title: '删除失败,请刷新页面重试', icon: 'error' })
      }
    },
    buy() {
      state.items = this.items
        .filter((c) => c.checked)
        .map((c) => ({
          ...c,
          // itemId: c.itemId,
          spu: { type: c.type },
        }))
      this.$goto('/pages/order/create?type=cart')
    },
  },
}
</script>
