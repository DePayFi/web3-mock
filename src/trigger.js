/*#if _EVM

import { triggerEvent as triggerEVMEvent } from './platforms/evm/events'

/*#elif _SVM

import { triggerEvent as triggerSolanaEvent } from './platforms/svm/events'

//#else */

import { triggerEvent as triggerEVMEvent } from './platforms/evm/events'
import { triggerEvent as triggerSolanaEvent } from './platforms/svm/events'

//#endif

import { triggerEvent as triggerWalletConnectEvent } from './wallets/walletConnect/events'
import { triggerEvent as triggerWalletLinkEvent } from './wallets/walletLink/events'
import { mocks } from './mocks'

export default (eventName, value) => {
  
  /*#if _EVM

  triggerEVMEvent(eventName, value)

  /*#elif _SVM

  triggerSolanaEvent(eventName, value)

  //#else */
  
  triggerEVMEvent(eventName, value)
  triggerSolanaEvent(eventName, value)

  //#endif

  triggerWalletConnectEvent(eventName, value)
  triggerWalletLinkEvent(eventName, value)
}
