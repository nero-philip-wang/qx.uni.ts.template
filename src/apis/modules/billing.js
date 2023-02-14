import store from '@/store'
import request from '../request'

export const settle = ({ buyerNickName, consignee, source, buyerRemark, items, selectedCoupons, deliveryType, pickupShopId }) => {
  return request('mall/billing/settle', 'post', {
    buyerNickName,
    deliveryType,
    consignee: consignee.mobile ? consignee : null,
    pickupShopId,
    source,
    sourceId: store.getters.sid,
    buyerRemark,
    items,
    selectedCoupons,
  })
}

export const create = (order) => {
  return request('mall/billing/create', 'post', order)
}

export const getpay = (id) => {
  return request(`mall/billing/${id}/pay?openId=${store.state.user.logged.openId}`, 'post')
}

export const apay = (id, data) => {
  return request(`mall/billing/${id}/apay`, 'post', data)
}

export const minpay = (id, data) => {
  return request(`mall/billing/${id}/mixpay?openId=${store.state.user.logged.openId}`, 'post', data)
}

export const cancel = (id) => {
  return request('mall/billing/' + id + '/cancel', 'post')
}

export const recharge = ({ amount, actId }) => {
  return request(`mall/billing/recharge`, 'post', { amount, openId: store.state.user.logged.openId, actId })
}
