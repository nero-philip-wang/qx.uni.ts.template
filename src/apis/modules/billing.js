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

export const settle = ({ buyerNickName, consignee, source, sourceId, buyerRemark, items }) => {
  return request('mall/billing/settle', 'post', {
    buyerNickName,
    deliveryType: 8,
    consignee,
    source,
    sourceId,
    buyerRemark,
    items,
  })
}

export const create = (order) => {
  return request('mall/billing/create', 'post', order)
}
