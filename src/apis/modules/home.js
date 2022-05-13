import request from '../request'

export const banner = () => {
  return request('mall/banners', 'get')
}

export const catalog = () => {
  return request('mall/catalogs', 'get')
}

export const item = ({ keywords, catalogCode, status, sort, skip, take }) => {
  return request('mall/items', 'get', { keywords, catalogCode, status, sort, skip, take })
}

export const hasNewAward = () => request('mall/activities', 'get', { enabled: true, type: 2, isValid: true, take: 1 }, { autoLogin: false })

export const tenant = () => request('mall/tenants', 'get')

export const page = () => request('mall/micropages', 'get')

export const getSence = (id) => request('mall/share/sence/' + id, 'get')
