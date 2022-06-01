import request from '../request'

export const home = () => request('mall/distribution/home', 'get')

export const order = (p) => request('mall/distribution/orders', 'get', p)

export const member = (paging) => request('mall/members', 'get', paging)