let normalize = function (input) {
  if (input instanceof Array) {
    return input.map((element) => normalize(element))
  } else {
    if (input.toString) {
      return input.toString().toLowerCase()
    } else if (typeof argument === 'string' && input.match('0x')) {
      return input.toLowerCase()
    } else {
      return argument
    }
  }
}

export default normalize
