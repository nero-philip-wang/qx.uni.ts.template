import { barcode, qrcode, svg2url } from 'pure-svg-code'

export const bar = (text, options) => {
  const svg = barcode(text, 'code128', options)
  const src = svg2url(svg)
  return src
}

export const qr = (text, options) => {
  const svg = qrcode({ content: text, ...options })
  const src = svg2url(svg)
  return src
}
