# qx.uni.ts.template

### 项目概要

这是一个基于 uni 跨平台框架的项目模板，主要面向小程序，使用的 uviewui[https://www.uviewui.com] 作为基础 UI 库，内置客户端绘图模块[https://gitee.com/liangei/lime-painter]

### 项目目录说明

```
components      全局通用的控件
config          各个商户的开发配置
filters         vue的filter
pages           主包的页面
pagesA          分包A的页面
    static      分包的静态文件
    components  分包的内部的组件
static          全局静态文件
store           全局的store，比如vuex
utils           自己编写的工具类
apis            api层
```

### 项目约定俗称

- 关键词 keyword
- 商品条码 code 或者 barcode
- 商品分类目录 catalog
- 商品 item
- 订单 order
- 购物车 cart
- 直播 live
- 优惠券 coupon
- 折扣 discount 或者 promotion
- 活动 activity
- 店铺 shop
- 店员、导购员 assistant 或者 saler
- 登录 login
- 余额 balance
- 用户 user
- 会员 member
- 积分 bonus 或者 points
- 详情页传递 id 参数，统一在路由中传递名为“id”的参数

### 项目常用 API

- Vue.\$goto

  - 通用多功能导航 api，支持 http 协议跳转、调程序跳转和 navigateBack（url 传 back），支持跳转到首页 tabbar

  - 希望在后续中能支持路由层数管理，解决小程序只能跳转 10 层的问题

- svgCode

  - 通过纯 js 的方式生产 svg 格式的条码或者二维码
  - 调用方式：

  ```js
  import { bar, qr } from '@/utils/svgCode'
  var barcode = bar("abcd1234")
  <image :src="barcode" />
  ```

### 项目常用公共功能

- 公众号云函数调用

  - 在 api.cloudapi 中注册客户端
  - 在 cloudbase/functions 中注册服务端

- 绘制海报功能

  - 引用 qx-painter 组件生成海报，其过程是先通过画布生成图片，然后隐藏画布，显示图片
  - 通过 board 来设置绘制对象，必须设置 height 和 width

- long 类型的 base64 压缩编码传输
  - 目前，小程序的 js 还不支持 long 类型的整形，故一般以 string 类型传输 long 类型，通过将 long 转为 byte 数组，再转为 base64 字符串，可以有效节约传输字节

```js
import longEncoder from '@/utils/share/longEncoder'
var bstr = longEncoder.encode(['1331333333333', '1353271009523929088', '1353256378520702976'])
console.log(bstr)
var longa = longEncoder.decode(bstr)
console.log(longa.map((c) => c.toString()))
```

- 省市区选择器

  - common/CityPicker
  - 支持 v-model ，传入编码
  - titles，支持 sync，返回选中的省市区数组
  - 支持 level，可以设置 1、2、3，对应：省、省市、省市区

- iconfont
  - 要使用 iconfont 的话，只需要在对应的 div 的 class 中添加“icon-”开通的的样式就行

```HTML
    <view class="icon-c">&#xe6e1;</view>
```
