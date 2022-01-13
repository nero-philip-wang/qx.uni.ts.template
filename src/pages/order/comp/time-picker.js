import funcs from 'uview-ui/libs/function/index'

function getDate(timestamp) {
  var time = new Date(timestamp)
  var dayOfWeek = time.getDay()
  switch (dayOfWeek) {
    case 1:
      dayOfWeek = '周一'
      break
    case 2:
      dayOfWeek = '周二'
      break
    case 3:
      dayOfWeek = '周三'
      break
    case 4:
      dayOfWeek = '周四'
      break
    case 5:
      dayOfWeek = '周五'
      break
    case 6:
      dayOfWeek = '周六'
      break
    case 0:
      dayOfWeek = '周日'
      break
  }
  return `${funcs.timeFormat(timestamp, 'mm-dd')}（${dayOfWeek}）`
}
function getTime(timestamp) {
  return funcs.timeFormat(timestamp, 'hh:MM')
}
var msOfaDay = 24 * 3600 * 1000
var msOfaHour = 3600 * 1000 + 1

export default {
  getNextDays(days = 5, from = 8, to = 21, step = 0.5, advanceHour = 12, specialHour = 19) {
    var now = Date.now()
    var advanceTime = Date.now() + advanceHour * msOfaHour
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    today = today.getTime()

    var buff = []
    for (let i = 0; i < days; i++) {
      var t = today + msOfaDay * i
      var timeofday = []
      for (let x = from; x <= to; x += step) {
        var time = t + msOfaHour * x
        if (time <= now) continue

        var type = 1 // 正常
        // 约满
        if (time <= advanceTime) type = 0
        // 加价
        else if (x >= specialHour) type = 2

        timeofday.push({ title: getTime(time), time, type })
      }
      buff.push({ title: getDate(t), children: timeofday })
    }
    return buff
  },
}
