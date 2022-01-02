import { resetRequire } from './require'
import { resetCurrentBlock } from './block'
import { getWindow } from './window'

let WalletConnectClass

let mocks = []

const setWalletConnectClass = (givenWalletConnectClass)=> {
  WalletConnectClass = givenWalletConnectClass
}

const resetMocks = ()=> {
  let window = getWindow()
  if (window.ethereum) {
    window.ethereum = undefined
  }
  mocks = []
  resetRequire()
  resetCurrentBlock()
  if(WalletConnectClass) {
    WalletConnectClass.instance = undefined
  }
}

resetMocks()

export { mocks, resetMocks, setWalletConnectClass }
