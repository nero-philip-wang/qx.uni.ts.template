import store from '@/store'

export const getarea = async () => {
  return new Promise((resolve, reject) => {
    if (store.state.area.length > 0) {
      resolve(store.state.area)
    } else {
      uni.request({
        url: 'https://s.re4.top/asset/pca-code.json',
        success: (res) => {
          store.commit('SAVE_AREA', res.data)
          resolve(store.state.area)
        },
      })
    }
  })
}
export const text2Code = async (text) => {
  // var list = await getarea()
  return null
}
