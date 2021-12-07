import { resetRequire } from './require'
import { resetCurrentBlock } from './block'
import { getWindow } from './window'

let mocks = []

let resetMocks = () => {
  let window = getWindow()
  if (window.ethereum) {
    window.ethereum = undefined
  }
  mocks = []
  resetRequire()
  resetCurrentBlock()
}

resetMocks()

export { mocks, resetMocks }
