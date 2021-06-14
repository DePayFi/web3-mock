import { Ethereum } from './blockchains'

export default ({ mocks, window = window }) => {
  if (mocks === undefined || mocks.length === 0) {
    throw 'Web3Mock: No mocks defined!'
  }

  mocks.forEach(function (mock) {
    let blockchain

    if (typeof mock === 'string') {
      blockchain = mock
    } else if (typeof mock === 'object') {
      if (Object.keys(mock).length != 1) {
        throw 'Web3Mock: Mock entries are supposed to exactly have 1 key, e.g. mocks: [ { ethereum: ... } ]'
      } else {
        blockchain = Object.keys(mock)[0]
      }
    } else {
      throw 'Web3Mock: Unknown mock type!'
    }

    switch (blockchain) {
      case 'ethereum':
        Ethereum({ ...mock, window })
        break
      default:
        throw 'Web3Mock: Unknown blockchain!'
    }
  })
}
