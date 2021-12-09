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
