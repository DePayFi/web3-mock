import { confirm as confirmEthereumTransaction } from './blockchains/ethereum/confirm'
import { confirm as confirmBscTransaction } from './blockchains/bsc/confirm'
import { mocks } from './mocks'

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
        throw 'Web3Mock: Unknown blockchain!'
    }
  } else {
    throw 'Web3Mock: Given mock is not a mocked transaction: ' + mock
  }
}
