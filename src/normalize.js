let normalize = function (input) {
  if (input instanceof Array) {
    return input.map((element) => normalize(element))
  } else if (typeof input === 'undefined') {
    return input
  } else if (typeof input === 'object' && input._isBigNumber && typeof mockParams == 'bigint') {
    return input.toString()
  } else {
    if (input?.toString) {
      return input.toString().toLowerCase()
    } else if (typeof input === 'object') {
      return JSON.stringify(input)
    } else if (typeof input === 'string' && input.match('0x')) {
      return input.toLowerCase()
    } else {
      return input
    }
  }
}

export default normalize
