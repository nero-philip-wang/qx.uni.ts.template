import request from '../request'

export const get = (id) => request('mall/items/' + id, 'get')
