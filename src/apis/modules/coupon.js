import request from '../request'

export const search = ({ status }) => request('mall/coupons/', 'get', { status })
