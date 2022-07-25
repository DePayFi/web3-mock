import raise from './raise'
import { confirm as confirmEvm } from './platforms/evm/confirm'
import { confirm as confirmSolana } from './platforms/solana/confirm'
import { increaseBlock } from './block'
import { mocks } from './mocks'
import { supported } from './blockchains'

export default (mock) => {
  if (mock?.transaction?._id) {
    mock.transaction._confirmed = true
    if(supported.evm.includes(mock.blockchain)) {
      confirmEvm(mock.transaction)
    } else if(supported.solana.includes(mock.blockchain)) {
      confirmSolana(mock.transaction)
    } else {
      raise('Web3Mock: Unknown blockchain!')
    }
    increaseBlock()
  } else {
    raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock))
  }
}
