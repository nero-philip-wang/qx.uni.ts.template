<template>
  <div class="flex-col h-page">
    <u-navbar safe-area-inset-top placeholder fixed bg-color="#F2F3F7" title="购物车">
      <div slot="left" class="pl-8 py-16 flex text-base">
        <span :class="{ active: deliveryType == 1 }" class="leftbtn" @click=";(deliveryType = 1), refresh++">快递</span>
        <span :class="{ active: deliveryType == 4 }" class="rightbtn" @click=";(deliveryType = 4), refresh++">自提</span>
      </div>
    </u-navbar>

    <div v-if="deliveryType == 4" class="flex mx-32 py-12 text-black-38 text-sm">
      <span class="flex-grow">到 {{ userSetting.depoTitle }} 自提</span>
      <span class="text-primary">更换门店 </span>
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
// import Enumerable from 'linq'
import from from '@/utils/linq'
import { get, updateQuantity, del, count } from '@/apis/modules/cart'
import listview from '@/components/listview'
import state from '@/store/easyState'
import store from '@/store'

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
      deliveryType: 1,
    }
  },
  computed: {
    checked: {
      get() {
        return from(this.items).all((c) => c.checked) ? [''] : []
      },
      set(v) {
        this.items.forEach((c) => {
          c.checked = !!v.length
        })
      },
    },
    itemAmount() {
      return from(this.items)
        .where((c) => c.checked)
        .sum((c) => (c.price || 0) * c.quantity)
    },
    argvs() {
      return { refresh: this.refresh }
    },
    userSetting() {
      return store.state.user
    },
  },
  async created() {
    await count()
    this.total = state.cartCount
  },
  methods: {
    async search({ take, skip }) {
      // 是从子组件调用的，this不是本页面的this
      var that = this.$parent
      var list = await get(
        {
          deliveryType: that.deliveryType,
          pickupShopId: that.deliveryType == 1 ? that.userSetting.mainDepoId : that.userSetting.depoId,
        },
        skip,
        take
      )
      list = list.map((c) => ({ ...c, checked: false, key: c.id, id: c.itemSpuId }))
      return list
    },
    update(item) {
      this.$u.debounce(async () => {
        await updateQuantity(item.key, item.quantity)
        this.total = state.cartCount
      }, 300)
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
      state.deliveryType = this.deliveryType
      state.pickupShopId = this.deliveryType == 1 ? this.userSetting.mainDepoId : this.userSetting.depoId
      state.pickupShopTitle = this.userSetting.depoTitle
      this.$goto('/pages/order/create?type=cart')
    },
  },
}
</script>

<style lang="scss" scoped>
.leftbtn {
  padding: 8rpx 32rpx;
  border-radius: 50rpx 0 0 50rpx;
  border: $u-primary solid 2rpx;
  border-right: 0;
  color: $u-primary;
}
.rightbtn {
  padding: 8rpx 32rpx;
  border-radius: 0 50rpx 50rpx 0;
  border: $u-primary solid 2rpx;
  color: $u-primary;
}
.leftbtn.active,
.rightbtn.active {
  background-color: $u-primary;
  color: white;
}
</style>
