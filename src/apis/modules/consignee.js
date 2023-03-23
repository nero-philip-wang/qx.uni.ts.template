import request from '../request'

export const search = ({ skip, take } = { skip: 0, take: 20 }) => request('mall/consignees', 'get', { skip, take })

export const get = (id) => request('mall/consignees/' + id, 'get')

export const create = (dto) => request('mall/consignees/', 'post', dto)

export const update = (dto) => request('mall/consignees/' + dto.id, 'put', dto)

export const del = (id) => {
  return request('mall/consignees/' + id, 'delete')
}

var pcaBuff = null
export const pca = async () => {
  if (!pcaBuff) {
    var [, result] = await uni.request({ url: 'https://s.re4.top/asset/pca-code.json', method: 'get' })
    pcaBuff = result && result.data
  }
  return pcaBuff
}
