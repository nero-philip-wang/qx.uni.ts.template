import request from '../request'

export const search = ({ status, take, skip }) => request('mall/coupons/', 'get', { status, take, skip })
