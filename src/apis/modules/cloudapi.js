/**
 * 公众号云函数调用
 */
let inited = false
if (!inited) {
  wx.cloud.init()
  inited = true
}

function call(action, data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'functions',
      data: {
        action,
        data,
      },
      success: (res) => {
        resolve(res.result)
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}

export const getUnlimited = ({ scene = '1', page = 'pages/index/index' }) => call('getUnlimited', { scene, page })
