<template>
  <view class="app">
    <!-- 头部 -->
    <navbar :scroll-top="scrollTop" :anchor-list="anchorList" />
    <div id="main" class="relative">
      <!-- 轮播图 -->
      <u-swiper
        :list="posts"
        indicator
        indicator-mode="line"
        circular
        img-mode="aspectFill"
        height="750rpx"
        :autoplay="!data.video"
        @click="previewImage"
      ></u-swiper>
      <!-- 价格 名称 -->
      <div class="bg-white pb-32">
        <div class="bg-white px-32 pt-40 flex flex-end">
          <span class="text-bold mr-32" :class="lv.discount ? 'text-vip' : 'text-price'">
            <span v-if="lv.discount" class="text-sm">会员价</span>
            <span class="text-base">￥</span>
            <span v-if="lv.discount" class="text-xl"> {{ (data.minRetailPrice * lv.discount) | yuan }}</span>
            <span v-else class="text-xl"> {{ data.minRetailPrice | yuan }}</span>
          </span>
          <span v-if="lv.discount" class="text-gray overline text-base mr-32"> ￥{{ data.minRetailPrice | yuan }} </span>
          <span v-else-if="data.markingPrice > data.minRetailPrice" class="text-gray overline text-base mr-32">
            ￥{{ data.markingPrice | yuan }}
          </span>
          <!-- 未开通时的会员价 -->
          <span v-if="!lv.title && memberlvList && memberlvList.length" class="text-gray text-bold text-base noVipPrice">
            会员价
            {{ (data.minRetailPrice * 0.8) | yuan }}
            <span class="text-xs">起</span>
          </span>

          <span class="flex-grow"></span>
          <span class="text-base">
            <span class="mr-8">热度</span>
            <span class="text-primary text-bold">100 </span>
          </span>
        </div>
        <!-- 会员权益 -->
        <Memberlv :show.sync="showMemberLv" @update:list="(v) => (memberlvList = v)">
          <template v-slot="{ discount }">
            <div class="noticebar mx-28 my-16 p-12 rounded overflow-hidden flex" @click="showMemberLv = true">
              <u-icon name="integral" color="#f9ae3d" size="32rpx"></u-icon>
              <span v-if="lv.title" class="ml-8 text-sm flex-grow">
                <span v-if="discount <= lv.discount + 0.01">升级会员低至{{ discount }}折，</span>
                当前等级：{{ lv.title || '普通会员' }}享{{ lv.discount | formatDiscount }}折
              </span>
              <span v-else class="ml-8 text-sm flex-grow"> 开通钻石会员享8折优惠+金牌保洁师服务 </span>
              <span v-if="!lv.title" class="mr-4 text-sm">立即开通</span>
              <u-icon name="arrow-right" color="#f9ae3d" size="32rpx"></u-icon>
            </div>
          </template>
        </Memberlv>

        <div class="bg-white px-32 flex align-center">
          <div style="width:600rpx" class="mr-16">
            <div class="text-bold text-base truncate">{{ data.title }}</div>
            <div class="text-sm text-gray mt-8">
              {{ data.description || '' }}
            </div>
          </div>
          <div @click="showShare = true">
            <u-icon name="share-square" size="64rpx"></u-icon>
            <div class="text-sm">分享</div>
          </div>
        </div>
        <!-- 促销 -->
        <div class="flex px-32 pt-8">
          <span v-if="data.moq" class="tag"> {{ data.moq }}件起订 </span>
          <span v-if="data.pcsPerCtn" class="tag"> {{ data.pcsPerCtn }}件一组 </span>
        </div>
      </div>

      <div class="bg-white mt-16">
        <u-cell-group :border="false">
          <u-cell is-link @click="showSku = true">
            <span slot="title" class="text-gray">购买</span>
          </u-cell>
          <u-cell :value="data.freightTemplateId ? data.freightTemplate.title : '免运费'">
            <span slot="title" class="text-gray">运费</span>
          </u-cell>
          <u-cell v-if="isDistributer" is-link @click="showShare = true">
            <span slot="title" class="text-gray">返利</span>
            <span slot="value"> 分享立赚 {{ ((data.rebate && data.rebate.details.rate) * data.minRetailPrice) | yuan }} 元 </span>
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
        <u-cell is-link @click="$goto(`pages/item/itemRating?id=${id}`)">
          <div slot="title">
            <span class="text-base text-bold mr-16">评价</span>
            <span class="text-gray text-sm"> {{ data.rating.all || '0' }}+ </span>
          </div>
          <div slot="value" class="text-gray text-sm"> 好评度 {{ data.rating.rating || '100%' }}</div>
        </u-cell>
      </u-cell-group>
      <div class="mx-32 my-24">
        <div class="text-gray text-sm mb-8">精选评论</div>
        <comment v-for="c in ratingData" :key="c.id" :data="c" />
      </div>
    </div>

    <!-- 图文详情 -->
    <div id="content" class="relative bg-white mt-24">
      <div class="text-gray text-sm py-8 px-24">图文详情</div>
      <div class="lineh-0">
        <image v-for="item in data.content" :key="item" lazy-load :src="item" mode="widthFix" style="width:100%" />
      </div>
      <qx-painter v-if="board" :board="board" @success="sharePicCreated" />
    </div>

    <!-- 底部操作菜单 -->
    <tabbar :count="count" :show-cart="showCart" @addtocart="showSku = true" @buynow="showSku = true" />
    <!-- 规格面板 -->
    <sku
      v-if="data.id"
      ref="skuPopup"
      :show-cart="showCart"
      :show.sync="showSku"
      :info-data="data"
      :quantity.sync="quantity"
      @setSku="setCurrentSku"
      @addToCart="addToCart"
      @buyNow="buyNow"
    ></sku>
    <poster :show.sync="showShare" :board="board" :spu="data" />
  </view>
</template>

<script>
import navbar from './comp/navbar' // 页面头
import comment from './comp/comment' // 页面头
import tabbar from './comp/tabbar' // 页面头
import sku from './comp/sku' // 页面头
import poster from './comp/poster.vue' // 页面头
import Memberlv from '@/pages/my/comp/memberlv.vue'

import { get as getitem, getRating } from '@/apis/modules/item'
import { setItems } from '@/apis/modules/billing'
import { hasrebate } from '@/apis/modules/asset'
import { count, add } from '@/apis/modules/cart'
import { mapMutations, mapState, mapGetters } from 'vuex'
import easyState from '@/store/easyState'
import getSharePic from './comp/getSharePic'
import shareLite from '@/utils/share/lite'
import { toYuan } from '@/utils/index'

export default {
  components: {
    sku,
    navbar,
    comment,
    tabbar,
    Memberlv,
    poster,
  },
  filters: {
    formatDiscount(dis) {
      if (isNaN(dis)) dis = 10
      else dis = (dis * 10).toFixed(1)
      return dis
    },
  },
  mixins: [shareLite],
  data() {
    return {
      scrollTop: 0,
      anchorList: [0, 0, 0],
      currentSku: {},
      data: {
        covers: [],
      },
      ratingData: [], // 评价
      quantity: 1,
      id: null,
      showSku: false,
      count: 0,
      showMemberLv: false,
      memberlvList: [],
      showShare: false,
      board: null,
    }
  },
  computed: {
    posts() {
      return this.data.video
        ? [{ url: this.data.video, poster: this.data.cover, type: 'video' }, ...this.data.covers.map((c) => ({ url: c }))]
        : this.data.covers
    },
    ...mapState({
      userId: (state) => state.user.logged && state.user.logged.id,
      lv: (state) => (state.user.logged && state.user.logged.level) || {},
      tenantId: (state) => state.user.tenantId,
      area: (state) => state.user.tenantArea,
    }),
    ...mapGetters(['isLogged', 'isDistributer']),
    showCart() {
      return this.data.type != 3
    },
  },
  onLoad(options) {
    this.id = options.id
  },
  onShow() {
    this.loadData()
    this.loadRating() // 加载评价
    this.loadCart()
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  methods: {
    previewImage(idx) {
      if (!this.data.video) {
        uni.previewImage({
          current: this.data.covers[idx],
          urls: this.data.covers,
        })
      } else if (idx > 0) {
        uni.previewImage({
          current: this.data.covers[idx - 1],
          urls: this.data.covers,
        })
      }
    },
    async loadData() {
      const res = await getitem(this.id)
      if (!res.status) {
        uni.showToast({ title: '产品不存在或已下架' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
        return
      }
      // 设置分享
      setTimeout(async () => {
        uni.$u.liteShare.title = res.title
        uni.$u.liteShare.page = '/pages/item/detail'
        uni.$u.liteShare.pageQuery = 'id=' + res.id
        uni.$u.liteShare.image = this.data.covers[0]
        this.board = await getSharePic({
          title: res.title,
          cover: res.cover,
          price: toYuan(res.minRetailPrice),
          mPrice: toYuan(res.marketPrice),
        })
      }, 100)

      // 加工规格
      res.specifications.forEach((item) => {
        item.values = item.values.map((c) => ({ ...c, checked: false }))
      })
      // if (res.covers.length > 1) res.covers.splice(res.covers.length - 1, 1)
      this.data = Object.assign({}, res)
      this.$nextTick(() => {
        this.calcAnchor() // 计算锚点参数
      })
      // 添加浏览历史
      // this.ADD_HISTORY({ id: res.id, cover: res.covers[0] })
    },
    // 加载评价
    async loadRating() {
      this.ratingData = await getRating(this.id, 0, 5)
      this.$nextTick(() => {
        this.calcAnchor() // 计算锚点参数
      })
    },
    async loadCart() {
      this.count = await count()
    },
    sharePicCreated(src) {
      uni.$u.liteShare.image = src
      this.board = null
    },
    // 加入购物车
    async addToCart(selected) {
      // 万一什么都没选中
      if (!selected) {
        return
      }
      // 判断用户登录状态
      if (!this.isLogged) {
        this.$goto('pages/login/login')
        return
      }

      var item = { ...selected }
      item.itemId = selected.id
      item.itemSpuId = this.data.id
      item.price = selected.retailPrice
      try {
        await add(item)
        this.count = easyState.cartCount
        this.showSku = false
        uni.showToast({ title: '已加入购物车', icon: 'success' })
      } catch (error) {
        uni.showToast({ title: '加入购物车失败', icon: 'error' })
      }
    },
    // 立即购买
    buyNow(selected) {
      // 万一什么都没选中
      if (!selected) {
        return
      }
      // 判断用户登录状态
      if (!this.isLogged) {
        this.$goto('pages/login/login')
        return
      }
      // 保存到store
      easyState.items = [{ ...selected, spu: this.data, itemId: selected.id }]
      // 跳转结算
      this.showSku = false
      // 如果page-container没有关闭就进入下一页，就无法返回上一页
      setTimeout(() => {
        this.$goto('/pages/order/create')
      }, 325)
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

  .tag {
    background-color: rgba($u-primary, 0.1);
    border-radius: 5rpx;
    font-size: 24rpx;
    height: 48rpx;
    line-height: 48rpx;
    padding: 0 24rpx;
    margin-right: 24rpx;
    color: $u-primary;
  }
  .noVipPrice {
    color: #fac987;
    padding: 4rpx 60rpx 4rpx 12rpx;
    border-radius: 6rpx;
    background: #423733 url(/static/img/vip1.png) center right no-repeat;
    background-size: 48rpx 48rpx;
  }

  .noticebar {
    background: linear-gradient(#4d4e50, #252429);
    color: #f7c684;
  }
}
</style>
