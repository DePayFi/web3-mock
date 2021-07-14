import { resetRequire } from './require'
import { getWindow } from './window'

let mocks = []

let resetMocks = () => {
  let window = getWindow()
  if (window.ethereum) {
    window.ethereum = undefined
  }
  mocks = []
  resetRequire()
}

resetMocks()

export { mocks, resetMocks }
