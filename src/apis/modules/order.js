import request from '../request'

export const search = ({ status, skip, take }) => request('mall/orders', 'get', { status, skip, take }, { autoLogin: false })

export const get = (id) => request('mall/orders/' + id, 'get')

export const count = (id) => request('mall/orders/count', 'get')

export const receipt = (id) => request(`mall/orders/${id}/receipt`, 'post')

export const comment = (data) => request(`mall/orders/${data.orderId}/comment`, 'post', data.list)
