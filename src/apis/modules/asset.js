import request from '../request'

export const all = (status) => request('mall/assets/', 'get', { status }, { autoLogin: false })

export const getrecord = (data) => request('mall/assets/detail', 'get', data)

export const cashout = (amount) => request('mall/assets/cashout', 'post', amount)

export const hasrebate = (status) => request('mall/assets/hasrebate', 'get', {}, { autoLogin: false })
