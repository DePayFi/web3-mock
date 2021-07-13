import { resetRequire } from './require'

let mocks = []

let resetMocks = () => {
  let window = global ? global : window
  if (window.ethereum) {
    window.ethereum.isMetaMask = undefined
  }
  mocks = []
  resetRequire()
}

resetMocks()

export { mocks, resetMocks }
