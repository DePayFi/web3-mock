import { getWindow } from './window'
import { resetCurrentBlock, resetBlockData } from './block'
import { resetRequire } from './require'
import { resetTransactionCount } from './vms/evm/transaction/count'

let WalletConnectClass, WalletLinkClass

let mocks = []

const setWalletConnectClass = (givenWalletConnectClass)=> {
  WalletConnectClass = givenWalletConnectClass
}

const setWalletLinkClass = (givenWalletLinkClass)=> {
  WalletLinkClass = givenWalletLinkClass
}

const resetMocks = ()=> {
  let window = getWindow()
  if (window.ethereum) {
    window.ethereum = undefined
  }
  mocks = []
  resetRequire()
  resetCurrentBlock()
  resetBlockData()
  resetTransactionCount()
  if(WalletConnectClass) { WalletConnectClass.instance = undefined }
  if(WalletLinkClass) { WalletLinkClass.instance = undefined }
}

resetMocks()

export { 
  mocks,
  resetMocks,
  setWalletConnectClass,
  setWalletLinkClass,
}
