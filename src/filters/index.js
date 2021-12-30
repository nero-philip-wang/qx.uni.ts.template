import utils from '@/utils'
import { timeFormat } from 'uview-ui/libs/function/index'

export function yuan(value) {
  if (!value) return '0'
  try {
    return utils.toYuan(value)
  } catch (error) {
    return value
  }
}

export function timef(datestring, fmt = 'yyyy-mm-dd hh:MM:ss') {
  var date = Date.parse(datestring)
  return timeFormat(date, fmt)
}

export function datef(datestring, fmt = 'yyyy-mm-dd') {
  var date = Date.parse(datestring)
  return timeFormat(date, fmt)
}

/** 使用oss的图片处理后缀 */
export function thumbnail(url, stylename = '!t360') {
  if (url && url.indexOf('s.re4.top') != -1 && /(jpg|png|bmp)/.test(url)) return `${url}${stylename}`
  else return url
}
