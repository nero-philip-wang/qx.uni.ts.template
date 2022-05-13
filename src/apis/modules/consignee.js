import request from '../request'

export const search = ({ skip, take } = { skip: 0, take: 20 }) => request('mall/consignees', 'get', { skip, take })

export const get = (id) => request('mall/consignees/' + id, 'get')

export const create = (dto) => request('mall/consignees/', 'post', dto)

export const update = (dto) => request('mall/consignees/' + dto.id, 'put', dto)

export const del = (id) => {
  return request('mall/consignees/' + id, 'delete')
}

const pcaurl = 'https://s.re4.top/asset/pca-code.json'
export const pca = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: pcaurl,
      method: 'get',
      success: async (rt) => {
        resolve(rt.data)
      },
      fail: (rt) => {
        reject(rt)
      },
      complete: () => {},
    })
  })
}
