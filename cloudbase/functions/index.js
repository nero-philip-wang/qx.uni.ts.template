// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async ({ action, data }, context) => {
  // const wxContext = cloud.getWXContext();

  var exec = new Executer()
  var func = exec[action]
  if (func) return func(data)
  else return 'action not found'
}

class Executer {
  /// 获取 UrlScheme
  async getUrlScheme() {
    return cloud.openapi.urlscheme.generate({
      jumpWxa: {
        path: '/pages/index/index', // <!-- replace -->
        query: '',
      },
      // 如果想不过期则置为 false，并可以存到数据库
      isExpire: false,
      // 一分钟有效期
      expireTime: parseInt(Date.now() / 1000 + 60),
    })
  }

  /// 获取 Unlimited
  async getUnlimited({ scene = '1', page = 'pages/index/index' }) {
    const wxacodeResult = await cloud.openapi.wxacode.getUnlimited({
      scene,
      page,
      is_hyaline: true,
    })

    const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^/]+)/)
    const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'
    const uploadResult = await cloud.uploadFile({
      // 云文件路径，此处为演示采用一个固定名称
      cloudPath: `wxacode/${scene}.${fileExtension}`,
      // 要上传的文件内容可直接传入图片 Buffer
      fileContent: wxacodeResult.buffer,
    })

    if (!uploadResult.fileID) {
      throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
    }

    return uploadResult.fileID
  }
}
