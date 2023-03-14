/*#if _EVM

import { fail as failEvm } from './platforms/evm/fail'

/*#elif _SOLANA

import { fail as failSolana } from './platforms/solana/fail'

//#else */

import { fail as failEvm } from './platforms/evm/fail'
import { fail as failSolana } from './platforms/solana/fail'

//#endif

import raise from './raise'
import { increaseBlock } from './block'
import { mocks } from './mocks'
import { supported } from './blockchains'

export default (mock, reason) => {
  if (mock?.transaction?._id) {
    mock.transaction._failed = true
    mock.transaction._confirmed = false
    if(supported.evm.includes(mock.blockchain)) {

      /*#if _EVM

      failEvm(mock.transaction, reason)
      
      /*#elif _SOLANA

      /*#else */
      
      failEvm(mock.transaction, reason)
      
      //#endif

    } else if(supported.solana.includes(mock.blockchain)) {

      /*#if _EVM

      /*#elif _SOLANA

      failSolana(mock.transaction, reason)

      /*#else */
      
      failSolana(mock.transaction, reason)
      
      //#endif

    } else {
      raise('Web3Mock: Unknown blockchain!')
    }
    increaseBlock()
  } else {
    raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock))
  }
}
