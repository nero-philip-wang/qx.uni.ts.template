export async function getCity() {
  var [err, res] = await uni.getLocation({ type: 'wgs84' })
  if (!err) {
    var { latitude, longitude } = res
    return { latitude, longitude }
  }
}
