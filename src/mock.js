import raise from './raise'
import { getWindow } from './window'
import { mock as mockBsc } from './blockchains/bsc/mock'
import { mock as mockEthereum } from './blockchains/ethereum/mock'
import { mock as mockWalletConnect } from './wallets/walletConnect/mock'
import { mocks } from './mocks'
import { requireMock } from './require'

let getBlockchain = (configuration) => {
  if (typeof configuration === 'string') {
    return configuration
  } else if (typeof configuration === 'object' && !Array.isArray(configuration)) {
    return configuration.blockchain
  } else {
    raise('Web3Mock: Unknown mock configuration type!')
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
    raise('Web3Mock: No mock defined!')
  } else if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
    raise('Web3Mock: Mock configuration is empty!')
  } else if (typeof configuration != 'string' && typeof configuration != 'object') {
    raise('Web3Mock: Unknown mock configuration type!')
  }
  if (apiIsMissing('call', configuration)) {
    raise(apiMissingErrorText('call', configuration))
  } else if (apiIsMissing('transaction', configuration)) {
    raise(apiMissingErrorText('transaction', configuration))
  } else if (apiIsMissing('estimate', configuration)) {
    raise(apiMissingErrorText('estimate', configuration))
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

let mockWallet = ({ configuration, window }) => {
  let wallet = configuration.wallet
  switch (wallet) {
    case 'metamask':
      window.ethereum.isMetaMask = true
      break
    case 'coinbase':
      window.ethereum.isCoinbaseWallet = true
      window.ethereum.isWalletLink = true
      break
    case 'walletconnect':
      mockWalletConnect({ configuration, window })
      break
    default:
      raise('Web3Mock: Unknown wallet!')
  }
}

let mockBlockchain = ({ blockchain, configuration, window, provider }) => {
  switch (blockchain) {
    case 'ethereum':
      return spy(mockEthereum({ blockchain, configuration, window, provider }))
      break
    case 'bsc':
      return spy(mockBsc({ blockchain, configuration, window, provider }))
      break
    default:
      raise('Web3Mock: Unknown blockchain!')
  }
}

let mock = (configuration, call) => {
  preflight(configuration)

  let window = getWindow(configuration)
  let blockchain = getBlockchain(configuration)
  let provider = configuration.provider
  let mock

  if (blockchain) { mock = mockBlockchain({ blockchain, configuration, window, provider }) }
  if (configuration.wallet) { mockWallet({ configuration, window }) }
  if (configuration.require) { requireMock(configuration.require) }
  if (provider) { provider._blockchain = blockchain }
  mocks.unshift(mock)

  return mock
}

export default mock
