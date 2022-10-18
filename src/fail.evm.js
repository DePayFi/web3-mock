import raise from './raise'
import { fail as failEvm } from './platforms/evm/fail'
import { increaseBlock } from './block'
import { mocks } from './mocks'
import { supported } from './blockchains.evm'

export default (mock, reason) => {
  if (mock?.transaction?._id) {
    mock.transaction._failed = true
    mock.transaction._confirmed = false
    if(supported.evm.includes(mock.blockchain)) {
      failEvm(mock.transaction, reason)
    } else {
      raise('Web3Mock: Unknown blockchain!')
    }
    increaseBlock()
  } else {
    raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock))
  }
}
