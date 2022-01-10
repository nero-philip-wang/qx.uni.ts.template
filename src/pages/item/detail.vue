<template>
  <view class="app">
    <!-- 头部 -->
    <navbar :scroll-top="scrollTop" :anchor-list="anchorList" />
    <div id="main" class="relative">
      <!-- 轮播图 -->
      <u-swiper
        :list="data.covers"
        indicator
        indicator-mode="line"
        circular
        img-mode="aspectFill"
        height="750rpx"
        @click="previewImage"
      ></u-swiper>
      <!-- 价格 名称 -->
      <div class="bg-white pb-32">
        <div class="bg-white px-32 pt-40 flex flex-end">
          <span class="text-price text-bold mr-32">
            <span class="text-base">￥</span>
            <span class="text-xl"> {{ data.minRetailPrice | yuan }}</span>
          </span>
          <span v-if="data.markingPrice > data.minRetailPrice" class="text-gray overline text-base">
            ￥{{ data.markingPrice | yuan }}
          </span>
          <span class="flex-grow"></span>
          <span class="text-base">
            <span class="mr-8">热度</span>
            <span class="text-primary text-bold">266 </span>
          </span>
        </div>
        <div class="bg-white px-32 pt-24 flex align-center">
          <div style="width:600rpx" class="mr-16">
            <div class="text-bold text-base truncate">{{ data.title }}</div>
            <div class="text-sm text-gray mt-8">
              {{ data.description || '' }}
            </div>
          </div>
          <button open-type="share" class="u-reset-button">
            <u-icon name="share-square" size="64rpx"></u-icon>
            <div class="text-sm">分享</div>
          </button>
        </div>
      </div>

      <div class="bg-white mt-16">
        <u-cell-group :border="false">
          <u-cell is-link @click="showSku = true">
            <span slot="title" class="text-gray">规格</span>
          </u-cell>
          <u-cell is-link :value="data.freightTemplateId ? '满99免运费' : '免运费'">
            <span slot="title" class="text-gray">运费</span>
          </u-cell>
          <u-cell is-link>
            <span slot="title" class="text-gray">返利</span>
            <button slot="value" open-type="share" class="u-reset-button">
              <!-- <span> 分享立赚 {{ (data.rebate.details.rate * data.minRetailPrice) | yuan }} 元 </span> -->
            </button>
          </u-cell>
          <!-- <u-cell is-link>
          <span slot="title" class="text-gray">优惠券</span>
        </u-cell>
        <u-cell is-link>
          <span slot="title" class="text-gray">促销</span>
        </u-cell>
        <u-cell is-link>
          <span slot="title" class="text-gray">服务</span>
          <span slot="value" class="text-gray">不满意免费更换 </span>
        </u-cell> -->
        </u-cell-group>
      </div>
    </div>

    <!-- 评价 -->
    <div id="rating" class="relative bg-white mt-24 pb-32">
      <u-cell-group :border="false" is-link>
        <u-cell>
          <div slot="title">
            <span class="text-base text-bold mr-16">评价</span>
            <span class="text-gray text-sm"> 100+ </span>
          </div>
          <div slot="value" class="text-gray text-sm"> 好评度 98% </div>
        </u-cell>
      </u-cell-group>
      <div class="mx-32 my-24">
        <div class="text-gray text-sm mb-8">精选评论</div>
        <comment />
        <comment />
      </div>
    </div>

    <!-- 图文详情 -->
    <div id="content" class="relative bg-white mt-24">
      <div class="text-gray text-sm py-8 px-24">图文详情</div>
      <div class="lineh-0">
        <image v-for="item in data.content" :key="item" lazy-load :src="item" mode="widthFix" style="width:100%" />
      </div>
    </div>

    <!-- 底部操作菜单 -->
    <tabbar />
    <!-- 规格面板 -->
    <sku
      v-if="data.id"
      ref="skuPopup"
      :show.sync="showSku"
      :info-data="data"
      :quantity.sync="quantity"
      @setSku="setCurrentSku"
      @addToCart="addToCart"
      @buyNow="buyNow"
    ></sku>
  </view>
</template>

<script>
import navbar from './comp/navbar' // 页面头
import comment from './comp/comment' // 页面头
import tabbar from './comp/tabbar' // 页面头
import sku from './comp/sku' // 页面头

import { get as getitem } from '@/apis/modules/item'
import { setItems } from '@/apis/modules/billing'
import { mapMutations, mapState, mapGetters } from 'vuex'

export default {
  components: {
    sku,
    navbar,
    comment,
    tabbar,
  },
  data() {
    return {
      scrollTop: 0,
      anchorList: [0, 0, 0],
      currentSku: {},
      data: {
        covers: [],
      },
      ratingData: null, // 评价
      quantity: 1,
      id: null,
      showSku: false,
    }
  },
  computed: {
    ...mapState({
      userId: (state) => state.user.userInfo && state.user.userInfo.id,
      tenantId: (state) => state.user.tenantId,
      area: (state) => state.user.tenantArea,
    }),
    ...mapGetters(['showRebate']),
  },
  onLoad(options) {
    this.id = options.id
  },
  onShow() {
    this.loadData()
    this.loadRating() // 加载评价
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  // #ifdef MP-WEIXIN
  onShareAppMessage(res) {
    return {
      title: this.data.title,
      path: `/pages/item/detail?id=${this.data.id}&sid=${this.userId}&t=${this.tenantId}&area=${this.area}`,
      imageUrl: this.data.covers[0],
    }
  },
  onShareTimeline(res) {
    return {
      title: this.data.title,
      query: `id=${this.data.id}&sid=${this.userId}&t=${this.tenantId}&area=${this.area}`,
      imageUrl: this.data.covers[0],
    }
  },
  // #endif
  methods: {
    previewImage(idx) {
      uni.previewImage({
        current: this.data.covers[idx],
        urls: this.data.covers,
      })
    },
    ...mapMutations(['ADD_HISTORY']),
    async loadData() {
      const res = await getitem(this.id)
      // if (!res.status) {
      //   uni.showToast({ title: '产品不存在或已下架' })
      //   setTimeout(() => {
      //     uni.navigateBack()
      //   }, 1000)
      //   return
      // }
      // data.content = data.content.replace(/img src="/g, 'img style="display:block;width:100%;height:auto" src="')
      // 加工规格
      res.specifications.forEach((item) => {
        item.values = item.values.map((c) => ({ ...c, checked: false }))
      })
      if (res.covers.length > 1) res.covers.splice(res.covers.length - 1, 1)
      this.data = Object.assign({}, res)
      this.$nextTick(() => {
        this.calcAnchor() // 计算锚点参数
      })
      // 添加浏览历史
      this.ADD_HISTORY({ id: res.id, cover: res.covers[0] })
    },
    // 加载评价
    async loadRating() {
      // this.ratingData = await getRating(this.id)
      this.$nextTick(() => {
        this.calcAnchor() // 计算锚点参数
      })
    },
    // 加入购物车
    addToCart() {
      this.$util.throttle(async () => {
        const data = this.getConfirmData()
        if (!data) {
          return
        }
        const res = {} /* await this.$request('cart', 'add', data, {
          showLoading: true,
          login: true,
        }) */
        if (!res) {
          return
        }
        this.log(res)
        this.$util.msg(res.msg)
        if (res.status === 1) {
          this.hidePopup('skuPopup')
          this.$store.dispatch('getCartCount') // 更新购物车数量
          uni.$emit('refreshCart') // 更新购物车
        }
      })
    },
    // 立即购买
    buyNow(selected) {
      console.log(selected)
      // 万一什么都没选中
      if (!selected) {
        return
      }
      // 判断用户登录状态
      if (!this.userId) {
        this.$goto('pages/login/login')
        return
      }
      // 保存到store
      setItems([{ ...selected, spu: this.data }])
      // 跳转结算
      this.hidePopup('skuPopup')
      this.$goto('/pages/order/create')
    },
    // 设置当前选择sku
    setCurrentSku(data) {
      this.currentSku = data
    },
    // 获取当前sku 如果没有sku返回默认规格
    getConfirmData() {
      if (!this.userId) {
        this.$goto('pages/login/login')
        return null
      }
      setItems([
        {
          ...this.data.skus[0],
          quantity: this.quantity || 1,
          //  cover: this.data.skus[0].cover || this.data.covers[0],
        },
      ])
      // const sku = this.currentSku._id ? this.currentSku : this.data.sku[0]
      // if (sku.stock <= 0 || this.data.stock <= 0) {
      //   this.$util.msg('库存不足')
      //   return false
      // }
      // const data = {
      //   product_id: this.data._id,
      //   number: this.$refs.skuPopup.buyNumber || 1,
      //   sku: this.currentSku._id ? this.currentSku : this.data.sku[0],
      // }
      // return data
      return {}
    },
    // 计算锚点参数
    async calcAnchor() {
      const size = await new Promise((resolve) => {
        uni
          .createSelectorQuery()
          .select('#rating')
          .boundingClientRect((data) => {
            resolve(data)
          })
          .exec()
      })

      const systemInfo = await new Promise((resolve) => {
        uni.getSystemInfo({
          success: (e) => {
            const systemInfo = e
            let navigationBarHeight
            let custom = {}
            // #ifndef MP
            custom = { height: 36, width: 88 }
            navigationBarHeight = 44
            // #endif
            // #ifdef MP
            custom = wx.getMenuButtonBoundingClientRect()
            navigationBarHeight = custom.bottom + custom.top - e.statusBarHeight * 2
            // #endif
            systemInfo.custom = custom
            systemInfo.navigationBarHeight = navigationBarHeight
            resolve(systemInfo)
          },
        })
      })

      const headerHeight = systemInfo.statusBarHeight + systemInfo.navigationBarHeight
      const a1 = (size ? size.top : 0) - headerHeight
      const a2 = (size ? size.bottom : 0) + uni.upx2px(24) - headerHeight
      this.anchorList = [0, a1, a2]
    },
  },
}
</script>

<style scoped lang="scss">
.app {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100rpx;
  }

  .anchor {
    position: absolute;
    top: -136rpx;
  }
}
</style>
