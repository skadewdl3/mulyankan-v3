/*
isNumber code courtesy of: Dan
Stackoverflow Post: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
Dan's Profile: https://stackoverflow.com/users/17121/dan
*/
export const isNumber = str => {
  // we only process strings!
  if (typeof str != 'string') return false
  // use type coercion to parse the entirety of the string (parseFloat alone does not do this)
  // and ensure strings of whitespace fail
  return !isNaN(str) && !isNaN(parseFloat(str))
}

export const roundOff = (num, scale) => {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + scale) + 'e-' + scale)
  } else {
    var arr = ('' + num).split('e')
    var sig = ''
    if (+arr[1] + scale > 0) {
      sig = '+'
    }
    return +(Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) + 'e-' + scale)
  }
}

export const getReducedAngle = rotation => {
  /*
  This function is used to reduce any angle from 0 - Infinity to the principal range of 0 - 360 degrees
  sin 0 = 0   cos0 = 1 (Note that 360 deg is equivalent to 0 deg)
  sin 90 = 1  cos90 = 0
  sin 180 = 0 cos180 = -1
  sin 270 = -1 cos270 = 0
  */

  const toRadians = angle => angle * (Math.PI / 180)
  const sine = angle => roundOff(Math.sin(toRadians(angle)), 1)
  const cosine = angle => roundOff(Math.cos(toRadians(angle)), 1)
  if (sine(rotation) === 0 && cosine(rotation) === 1) {
    return 0
  } else if (sine(rotation) === 1 && cosine(rotation) === 0) {
    return 90
  } else if (sine(rotation) === 0 && cosine(rotation) === -1) {
    return 180
  } else if (sine(rotation) === -1 && cosine(rotation) === 0) {
    return 270
  }
}

export const downloadURI = (uri, name) => {
  var link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
