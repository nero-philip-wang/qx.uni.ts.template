import request from '../request'
import store from '@/store'
var posters = null

export const banner = () => request('mall/banners', 'get', null, { needLogin: false, autoLogin: false })

export const catalog = () => request('mall/catalogs', 'get', null, { needLogin: false, autoLogin: false })

export const item = ({ keywords, catalogCode, status, sort, skip, take }) =>
  request('mall/items', 'get', { keywords, catalogCode, status, sort, skip, take }, { needLogin: false, autoLogin: false })

export const hasNewAward = () =>
  request('mall/activities', 'get', { enabled: true, type: 2, isValid: true, take: 1 }, { needLogin: false, autoLogin: false })

export const tenant = () => request('mall/tenants', 'get', null, { needLogin: false, autoLogin: false })

export const page = () => request('mall/micropages', 'get', null, { needLogin: false, autoLogin: false })

export const getSence = (id) => request('mall/share/sence/' + id, 'get', {}, { needLogin: false, autoLogin: false })

export const listMemberLevel = () => request('mall/users/memberLevel', 'get', null, { needLogin: false, autoLogin: false })

export const getPoster = async () => {
  if (posters) return posters
  else {
    posters = await request('mall/share/poster', 'get')
    return posters
  }
}

export const getMember = async () => {
  var result = await request('mall/users/detail', 'get', {}, { needLogin: false, autoLogin: false })
  store.commit('SET_MEMBER', result)
}

export const getCities = (TenantId) => request('mall/tenants/city', 'get', null, { needLogin: false, autoLogin: false }, { TenantId })

export const getStores = (city) => request('mall/tenants/store', 'get', { city }, { needLogin: false, autoLogin: false })
