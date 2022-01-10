import request from '../request'

export const get = (id) => request('mall/employees/' + id, 'get')
