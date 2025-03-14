/*#if _EVM

import { confirm as confirmEvm } from './platforms/evm/confirm'

/*#elif _SVM

import { confirm as confirmSolana } from './platforms/svm/confirm'

//#else */

import { confirm as confirmEvm } from './platforms/evm/confirm'
import { confirm as confirmSolana } from './platforms/svm/confirm'

//#endif

import raise from './raise'
import { increaseBlock } from './block'
import { mocks } from './mocks'
import { supported } from './blockchains'

export default (mock) => {
  if (mock?.transaction?._id) {
    mock.transaction._confirmed = true
    if(supported.evm.includes(mock.blockchain)) {

      /*#if _EVM

      confirmEvm(mock.transaction)
      
      /*#elif _SVM

      /*#else */
      
      confirmEvm(mock.transaction)
      
      //#endif

    } else if(supported.solana.includes(mock.blockchain)) {

      /*#if _EVM

      /*#elif _SVM

      confirmSolana(mock.transaction)

      /*#else */
      
      confirmSolana(mock.transaction)
      
      //#endif

    } else {
      raise('Web3Mock: Unknown blockchain!')
    }
    increaseBlock()
  } else {
    raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock))
  }
}
