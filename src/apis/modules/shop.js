import request from '../request'

export const get = (id) => request('mall/tenants/store/' + id, 'get')
