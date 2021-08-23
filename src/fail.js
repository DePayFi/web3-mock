import { fail as failBscTransaction } from './blockchains/bsc/fail'
import { fail as failEthereumTransaction } from './blockchains/ethereum/fail'
import { mocks } from './mocks'
import { increaseBlock } from './block'

export default (mock) => {
  if (mock?.transaction?._id) {
    mock.transaction._failed = true
    mock.transaction._confirmed = false
    switch (mock.blockchain) {
      case 'ethereum':
        failEthereumTransaction(mock.transaction)
        break
      case 'bsc':
        failBscTransaction(mock.transaction)
        break
      default:
        raise('Web3Mock: Unknown blockchain!')
    }
    increaseBlock()
  } else {
    raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock))
  }
}
