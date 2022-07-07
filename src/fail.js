import { fail as failEvm } from './platforms/evm/fail'
import { mocks } from './mocks'
import { increaseBlock } from './block'
import { supported } from './blockchains'

export default (mock) => {
  if (mock?.transaction?._id) {
    mock.transaction._failed = true
    mock.transaction._confirmed = false
    if(supported.evm.includes(mock.blockchain)) {
      failEvm(mock.transaction)
    } else {
      raise('Web3Mock: Unknown blockchain!')
    }
    increaseBlock()
  } else {
    raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock))
  }
}
