import request from '../request'

export const home = () => request('mall/distribution/home', 'get')

export const order = (p) => request('mall/distribution/orders', 'get', p)

export const member = (paging) => request('mall/members', 'get', paging)

export const index = () => request('mall/distribution', 'get')

export const distributer = (p) => request('mall/distribution/distributers', 'get', p)