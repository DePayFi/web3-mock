let normalize = function (input) {
  if (input instanceof Array) {
    return input.map((element) => normalize(element))
  } else if (typeof input === 'undefined') {
    return input
  } else {
    if (input.toString) {
      return input.toString().toLowerCase()
    } else if (typeof input === 'string' && input.match('0x')) {
      return input.toLowerCase()
    } else {
      return input
    }
  }
}

export default normalize
