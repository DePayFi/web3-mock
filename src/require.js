let required = []

let requireMock = (type) => {
  required.push(type)
}

let resetRequire = () => {
  required = []
}

export { requireMock, required, resetRequire }
