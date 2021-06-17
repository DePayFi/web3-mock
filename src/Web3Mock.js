import { Ethereum } from './blockchains'

let mocks = []

let mock = function ({ configuration, window }) {
  let blockchain

  if (typeof configuration === 'string') {
    blockchain = configuration
  } else if (typeof configuration === 'object') {
    blockchain = Object.keys(configuration)[0]
  } else {
    throw 'Web3Mock: Unknown mock configuration type!'
  }

  switch (blockchain) {
    case 'ethereum':
      mocks.push(Ethereum({ configuration: configuration['ethereum'], window }))
      break
    default:
      throw 'Web3Mock: Unknown blockchain!'
  }
}

let Web3Mock = ({ mocks, window = window }) => {
  if (mocks === undefined || mocks.length === 0) {
    throw 'Web3Mock: No mocks defined!'
  }

  if (mocks instanceof Array) {
    mocks.forEach((configuration) => {
      if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
        throw 'Web3Mock: Mock configurations are empty!'
      }
      mock({ configuration, window })
    })
  } else if (typeof mocks === 'string') {
    mock({ configuration: mocks, window })
  } else if (typeof mocks === 'object') {
    if (Object.keys(mocks).length === 0) {
      throw 'Web3Mock: Mock configurations are empty!'
    }
    for (const [blockchain, configuration] of Object.entries(mocks)) {
      mock({ configuration: { [blockchain]: configuration }, window })
    }
  } else {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
}

Web3Mock.trigger = (eventName, value) => {
  mocks.forEach((blockchainMock) => blockchainMock.trigger(eventName, value))
}

export default Web3Mock
