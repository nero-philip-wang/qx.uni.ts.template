import store from '@/store'
import request from '../request'

export const setConsignee = (consignee) => {
  store.commit('SET_CONSIGNEE', consignee)
}

export const setItems = (items) => {
  store.commit(
    'SET_ITEMS',
    items.map((c) => ({
      ...c,
      itemId: c.id,
    }))
  )
}

export const settle = ({ buyerNickName, consignee, source, buyerRemark, items, selectedCoupons }) => {
  return request('mall/billing/settle', 'post', {
    buyerNickName,
    deliveryType: 8,
    consignee,
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
  return request(`mall/billing/${id}/mixpay?openId=${store.state.user.openId}`, 'post', data)
}

export const cancel = (id) => {
  return request('mall/billing/' + id + '/cancel', 'post')
}

export const recharge = ({ amount, actId }) => {
  return request(`mall/billing/recharge`, 'post', { amount, openId: store.state.user.logged.openId, actId })
}
