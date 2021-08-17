import raise from './raise'
import { confirm as confirmBscTransaction } from './blockchains/bsc/confirm'
import { confirm as confirmEthereumTransaction } from './blockchains/ethereum/confirm'
import { mocks } from './mocks'
import { increaseBlock } from './block'

export default (mock) => {
  if (mock?.transaction?._id) {
    mock.transaction._confirmed = true
    switch (mock.blockchain) {
      case 'ethereum':
        confirmEthereumTransaction(mock.transaction)
        break
      case 'bsc':
        confirmBscTransaction(mock.transaction)
        break
      default:
        raise('Web3Mock: Unknown blockchain!')
    }
    increaseBlock()
  } else {
    raise('Web3Mock: Given mock is not a confirmed transaction: ' + JSON.stringify(mock))
  }
}
