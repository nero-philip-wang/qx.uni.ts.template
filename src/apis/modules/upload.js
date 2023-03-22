import request from '../request'
const URL = 'https://s.re4.top/'

export const gettoken = (path) => request('default/shared/uploadtoken/temp', 'get', { path })

export const upload = async (path, file, addition) => {
  var res = await gettoken(path)
  var form = {
    url: res.url,
    path: res.path,
    policy: res.policy,
    signature: res.signature,
    OSSAccessKeyId: res.ossAccessKeyId,
  }
  var [err] = await uni.uploadFile({
    url: URL,
    filePath: file,
    formData: { ...form, key: `${form.path}${addition}` },
    name: 'file',
  })
  if (!err) return `${URL}${form.path}${addition}`
  else {
    console.log(err)
    return null
  }
}
