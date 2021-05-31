import request from '../request'

export const banner = () => {
  return request('mall/banners', 'get')
}

export const catalog = () => {
  return request('mall/catalogs', 'get')
}

export const item = ({ keywords, catalogId, status, sort }) => {
  return request('mall/items', 'get', { keywords, catalogId, status, sort })
}
