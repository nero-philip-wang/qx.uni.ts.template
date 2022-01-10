import request from '../request'

export const get = (id) => request('mall/items/' + id, 'get')

export const getRating = (id, skip = 0, take = 10) => request('mall/items/' + id + '/rating', 'get', { take, skip })
