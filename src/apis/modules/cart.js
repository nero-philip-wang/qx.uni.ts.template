import request from '../request'
import state from '@/store/easyState'

export const count = async (status) => {
  var count = await request('mall/cart/count', 'get', null, { autoLogin: false })
  state.cartCount = count
  return count
}

export const get = (p, skip = 0, take = 10) => request('mall/cart/', 'get', { ...p, take, skip }, { autoLogin: false })

export const add = async (item) => {
  var count = await request('mall/cart/', 'post', item, { autoLogin: false })
  state.cartCount = count
  console.log(state)
}

export const del = async (id) => {
  var count = await request(`mall/cart/${id}`, 'delete')
  state.cartCount = count
}

export const updateQuantity = async (id, quantity) => {
  var count = await request(`mall/cart/${id}`, 'post', quantity)
  state.cartCount = count
}
