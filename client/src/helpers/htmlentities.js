function htmlEntityEncode(str) {
  if (!str || !str.length) return ''
  var buf = []

  for (var i = str.length - 1; i >= 0; i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
  }

  return buf.join('')
}

function htmlEntityDecode(str) {
  if (!str || !str.length) return ''
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec)
  })
}

function getHtmlEntityCodeFromDecodedString(str) {
  let string = htmlEntityEncode(str)
  string = string.replace('&#', '')
  string = string.replace(';', '')
  return string
}

export { htmlEntityDecode, htmlEntityEncode, getHtmlEntityCodeFromDecodedString }
