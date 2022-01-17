import { cancel, getpay, apay, minpay } from '@/apis/modules/billing'
import { receipt } from '@/apis/modules/order.js'
import $goto from '../../../utils/goto'

export default {
  filters: {
    orderstatus: (status) => {
      switch (status) {
        case 1:
          return '待支付'
        case 2:
          return '待派单'
        case 3:
          return '待上门'
        case 4:
          return '待评价'
        case 5:
          return '已完成'
        case -1:
          return '已取消'
      }
    },
  },
  methods: {
    gopay(order) {
      $goto(`/pages/order/pay?orderId=${order.id}&amount=${order.unPaidAmount}`)
    },
    // 支付订单
    async apay(orderId, data) {
      try {
        await apay(orderId, data)
        uni.showToast({ title: '支付成功' })
        $goto('/pages/order/detail?id=' + orderId, { way: 'replace' })
      } catch (error) {
        uni.showToast({ title: '支付失败' })
        $goto('/pages/order/detail?id=' + orderId, { way: 'replace' })
      }
    },
    // 支付订单
    async pay(order) {
      try {
        var payparams = await getpay(order.id)
        if (payparams == '已支付') {
          uni.showToast({ title: '支付成功' })
          $goto('/pages/order/detail?id=' + order.id, { way: 'replace' })
          return
        }
        payparams = JSON.parse(payparams)
        wx.requestPayment({
          ...payparams,
          success: (res) => {
            uni.showToast({ title: '支付成功' })
            order.status = 2
            $goto('/pages/order/detail?id=' + order.id, { way: 'replace' })
          },
          fail: (res) => {
            uni.showToast({ title: '支付失败' })
            $goto('/pages/order/detail?id=' + order.id, { way: 'replace' })
          },
        })
      } catch (error) {
        uni.showToast({ title: '支付失败' })
        $goto('/pages/order/detail?id=' + order.id, { way: 'replace' })
      }
    },
    // 支付订单
    async minpay(orderId, data) {
      try {
        var payparams = await minpay(orderId, data)
        if (payparams == '已支付') {
          uni.showToast({ title: '支付成功' })
          $goto('/pages/order/detail?id=' + order.id, { way: 'replace' })
          return
        }
        payparams = JSON.parse(payparams)
        wx.requestPayment({
          ...payparams,
          success: (res) => {
            uni.showToast({ title: '支付成功' })
            $goto('/pages/order/detail?id=' + orderId, { way: 'replace' })
          },
          fail: (res) => {
            uni.showToast({ title: '支付失败' })
            $goto('/pages/order/detail?id=' + orderId, { way: 'replace' })
          },
        })
      } catch (error) {
        uni.showToast({ title: '支付失败' })
        $goto('/pages/order/detail?id=' + orderId, { way: 'replace' })
      }
    },
    // 取消订单弹窗确认
    cancel(data) {
      uni.showModal({ content: '您是否确定要取消订单' }).then(async (d) => {
        var [, res] = d
        if (res.confirm) {
          try {
            await cancel(data.id)
            uni.showToast({ title: '已取消' })
            data.status = 5
          } catch (error) {
            uni.showToast({ title: '取消失败' })
          }
        }
      })
    },
    confirmReceipt(item) {
      uni.showModal({
        title: '确认服务已完成',
        content: '本次服务已完成并验收合格、无物品损坏丢失',
        success: async (res) => {
          if (res.confirm) {
            var status = await receipt(item.id)
            item.status = status
            $goto('/pages/order/comment?id=' + item.id)
          }
        },
      })
    },
    gotoComment(order) {
      $goto('/pages/order/comment?id=' + order.id)
    },
  },
}
