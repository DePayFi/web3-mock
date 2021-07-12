import { confirm as confirmEthereumTransaction } from './blockchains/ethereum/request/transaction/confirm'
import { mocks } from './mocks'

export default (mock) => {
  if (mock?.transaction?._id) {
    mock.transaction._confirmed = true
    switch (mock.blockchain) {
      case 'ethereum':
        confirmEthereumTransaction(mock.transaction)
        break
    }
  } else {
    throw 'Web3Mock: Given mock is not a mocked transaction: ' + mock
  }
}
