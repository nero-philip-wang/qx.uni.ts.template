import jsbi from 'jsbi'
import base64 from 'base64-js'
const BigInt = jsbi.BigInt

export const Long2Byte = (longvalue) => {
  var length = longvalue.length
  var buff = new Uint8Array(8 * length)
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < 8; j++) {
      buff[i * 8 + j] = parseInt(jsbi.signedRightShift(longvalue[i], BigInt(8 * j))) & 0xff
    }
  }
  return buff
}
export const Byte2Long = (buff) => {
  var array = []
  for (let i = 0; i < buff.length; i += 8) {
    var result = BigInt(0)
    for (let j = 0; j < 8; j++) {
      result = jsbi.add(result, jsbi.leftShift(BigInt(buff[i + j]), BigInt(8 * j)))
    }
    array.push(result)
  }
  return array
}

export default {
  encode(longarray) {
    var array = longarray.map((c) => BigInt(c))
    return base64.fromByteArray(Long2Byte(array))
  },
  decode(base64string) {
    var buff = base64.toByteArray(base64string)
    return Byte2Long(buff)
  },
}
