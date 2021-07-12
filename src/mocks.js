let mocks = []

let resetMocks = () => {
  let window = global ? global : window
  if (window.ethereum) {
    window.ethereum.isMetaMask = undefined
  }
  mocks = []
}

resetMocks()

export { mocks, resetMocks }
