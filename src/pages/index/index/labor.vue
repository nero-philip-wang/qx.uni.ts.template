<template>
  <div class="page">
    <!-- 标题 -->
    <div class="title">
      <img class="logo" alt="logo" />
      <div class="solgon">
        爱的供养
      </div>
    </div>
    <!-- 轮播图 -->
    <div class="swipe">
      <u-swiper height="150px" effect3d effect3d-previous-margin="24" :list="banners['首页顶部轮播']"></u-swiper>
    </div>
    <!-- 金刚区 -->
    <div class="diamonds">
      <u-grid :col="autoColNum">
        <u-grid-item v-for="item in banners['金刚区']" :key="item.id" :icon="item.src" :text="item.title">
          <u-image :src="item.src" mode="aspectFill" height="72" width="72"></u-image>
          <view class="grid-text">{{ item.title }}</view>
        </u-grid-item>
      </u-grid>
    </div>
    <!-- 固定公告位 -->
    <div class="fixad">
      <image v-for="item in banners['固定半宽']" :key="item.id" class="images" mode="aspectFill" :src="item.src" />
    </div>

    <!-- 商品区 -->
    <u-sticky>
      <u-tabs :list="catalogs" is-scroll name="title" :current="tabcurrent" @change="tabChange"></u-tabs>
    </u-sticky>
    <div v-for="item in items" :key="item.id" class="itemcard" @click="$goto('/pages/item/detail?id=' + item.id)">
      <div class="covers">
        <image class="main" mode="aspectFill" :src="item.covers && item.covers[0]" />
        <div class="sider">
          <div class="small">
            <image class="small" mode="aspectFill" :src="item.covers && item.covers[1]" />
          </div>
          <div class="small">
            <image class="small" mode="aspectFill" :src="item.covers && item.covers[2]" />
          </div>
        </div>
      </div>
      <div class="ititle">
        {{ item.title }}
      </div>
      <div class="lastline">
        <div class="price">
          <span class="en"> {{ item.markingPrice | yuan }} </span>
          /2h
        </div>
        <div class="buy">
          <u-button size="small">
            立即购买
          </u-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { banner, catalog, item } from '@/apis/modules/home'

export default {
  data() {
    return {
      tabcurrent: 0,
      banner_raw: [],
      catalogs: [],
      items: [],
    }
  },
  computed: {
    banners() {
      const obj = {}
      if (this.banner_raw == null || this.banner_raw.length < 1) return obj
      else {
        this.banner_raw.forEach((element) => {
          var converted = element.banner.map((c) => ({ image: c.src, ...c }))
          obj[element.position] = converted
          if (converted.length < 2) converted.push({ ...converted[0], id: 0 })
        })
        return obj
      }
    },
    autoColNum() {
      const length = this.banners['金刚区'] && this.banners['金刚区'].length
      if (length % 4 == 0) return 4
      else return 5
    },
  },
  async created() {
    this.banner_raw = await banner()
    console.log(this.banner_raw)
    this.catalogs = await catalog()
    console.log(this.catalogs)
    this.items = await item({
      catalogId: this.catalogs && this.catalogs[0] && this.catalogs[0].id,
    })
  },
  methods: {
    async tabChange(idx) {
      this.tabcurrent = idx
      this.items = await item({
        catalogId: this.catalogs[idx].id,
      })
      this.items.push(...this.items)
    },
  },
}
</script>

<style lang="scss">
.diamonds {
  .van-grid-item__text {
    margin-top: 0 !important;
  }
}
</style>
<style lang="scss" scoped>
.page {
  margin-bottom: 2.45rem;
  background-color: #f1f3f5;
}

.title {
  margin: 0 8px;
  display: flex;
  align-items: flex-end;
  .logo {
    height: 40px;
    width: 120px;
    background-color: aquamarine;
  }
  .solgon {
    margin-left: 6px;
    padding: 6px;
  }
}

.swipe {
  // .card {
  // height: 150px;
  // width: 359px;
  margin: 8px 0;
  // color: #fff;
  // font-size: 20px;
  // line-height: 150px;
  // text-align: center;
  // background-color: #39a9ed;
  // border-radius: 5px;
  // overflow: hidden;
  // }
}

.diamonds {
  margin: 0 8px;
  border-radius: 5px;
  background-color: #fff;
  overflow: hidden;
}

.fixad {
  margin: 8px;
  .images {
    height: 65px;
    width: 175px;
    border-radius: 5px;
    overflow: hidden;
  }
  .images:nth-child(2n) {
    margin-left: 8px;
  }
}

.itemcard {
  margin: 8px;
  border-radius: 5px;
  overflow: hidden;
  padding: 9px;
  background: #fff;
  .covers {
    display: flex;
    .main {
      width: 228px;
      height: 114px;
    }
    .sider {
      margin-left: 8px;
      .small {
        margin: 0 0 8px 0;
        width: 106px;
        height: 53px;
      }
    }
  }
  .lastline {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    .price {
      background: red;
      color: #fff;
      height: 24px;
      line-height: 24px;
      padding: 0px 2px;
      .en {
        font-size: 16px;
        font-weight: bolder;
      }
    }
  }
}
</style>
