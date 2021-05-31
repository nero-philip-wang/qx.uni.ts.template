import request from '../request'

export const search = ({ status, skip, take }) => request('mall/orders', 'get', { status, skip, take })

export const get = (id) => request('mall/orders/' + id, 'get')
