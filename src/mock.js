import { mock as mockEthereum } from './blockchains/ethereum'
import { mocks } from './mocks'

let getWindow = (configuration) => {
  if (configuration.window) return configuration.window
  if (typeof global == 'object') return global
  if (typeof window == 'object') return window
}

let getBlockchain = (configuration) => {
  if (typeof configuration === 'string') {
    return configuration
  } else if (typeof configuration === 'object' && !Array.isArray(configuration)) {
    return configuration.blockchain
  } else {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
}

let apiIsMissing = (type, configuration) => {
  if (
    typeof configuration[type] == 'undefined' ||
    typeof configuration[type].method == 'undefined'
  ) {
    return false
  }
  return configuration[type] && configuration[type]?.api === undefined
}

let apiMissingErrorText = (type, configuration) => {
  return (
    'Web3Mock: Please provide the api for the ' +
    type +
    ': ' +
    JSON.stringify(
      Object.assign(configuration, {
        [type]: Object.assign(configuration[type], { api: ['PLACE API HERE'] }),
      }),
    )
  )
}

let preflight = (configuration) => {
  if (configuration === undefined || configuration.length === 0) {
    throw 'Web3Mock: No mock defined!'
  } else if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
    throw 'Web3Mock: Mock configuration is empty!'
  } else if (typeof configuration != 'string' && typeof configuration != 'object') {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
  if (apiIsMissing('call', configuration)) {
    throw apiMissingErrorText('call', configuration)
  } else if (apiIsMissing('transaction', configuration)) {
    throw apiMissingErrorText('transaction', configuration)
  } else if (apiIsMissing('estimate', configuration)) {
    throw apiMissingErrorText('estimate', configuration)
  }
}

let spy = (mock) => {
  if (typeof mock != 'object') {
    return mock
  }
  let all = []
  mock.calls = {
    add: (call) => {
      all.push(call)
    },
    all: () => all,
    count: () => all.length,
  }
  return mock
}

export default (configuration, call) => {
  preflight(configuration)

  let window = getWindow(configuration)
  let blockchain = getBlockchain(configuration)
  let provider = configuration.provider
  let mock

  switch (blockchain) {
    case 'ethereum':
      mock = spy(mockEthereum({ configuration: configuration, window, provider }))
      mocks.push(mock)
      break
    default:
      throw 'Web3Mock: Unknown blockchain!'
  }

  return mock
}
