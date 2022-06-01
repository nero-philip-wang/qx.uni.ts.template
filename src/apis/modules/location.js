import config from '@/config/index'
import QQMapWX from '@/utils/qqmap-wx-jssdk'
var qqmapsdk = new QQMapWX({
  key: 'WO6BZ-XNAC5-VKCI3-QPFQO-EJCC3-WOFZS',
})

export function getCity() {
  return new Promise((resolve, reject) => {
    if (!config.hasGpsOnce) {
      resolve(null)
      return
    }
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        var { latitude, longitude } = res
        qqmapsdk.reverseGeocoder({
          location: { latitude, longitude },
          success: function(res) {
            const city = res.result.ad_info.city
            resolve(city)
          },
          fail: function(res) {
            reject(res)
          },
          complete: function(res) {},
        })
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}
