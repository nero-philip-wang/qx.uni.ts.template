import request from '../request'
import store from '@/store'

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

export const listMemberLevel = () => request('mall/users/memberLevel', 'get')

var posters = null
export const getPoster = async () => {
  if (posters) return posters
  else {
    posters = await request('mall/share/poster', 'get')
    return posters
  }
}

export const getMember = async () => {
  var m = await request('mall/users/detail', 'get', {}, { autoLogin: false })
  if (m) {
    store.commit('SET_USERINFO', {
      ...m,
      token: store.state.user.logged.token,
      openId: store.state.user.logged.openId,
    })
  }
  return m
}

export const getCities = () => request('mall/tenants/city', 'get')
export const getStores = (city) => request('mall/tenants/store', 'get', { city })
