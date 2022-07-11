import getRandomTransactionHash from './platforms/evm/transaction/getRandomTransactionHash.js'
import raise from './raise'
import { getWindow } from './window'
import { mock as mockEvm } from './platforms/evm/mock'
import { mock as mockSolana } from './platforms/solana/mock'
import { mock as mockWalletConnect } from './wallets/walletConnect/mock'
import { mock as mockWalletLink } from './wallets/walletLink/mock'
import { mocks } from './mocks'
import { requireMock } from './require'
import { supported } from './blockchains'

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
  if (apiIsMissing('request', configuration)) {
    raise(apiMissingErrorText('request', configuration))
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
    case 'phantom':
      window.solana.isPhantom = true
      break
    case 'walletconnect':
      mockWalletConnect({ configuration, window })
      break
    case 'walletlink':
      mockWalletLink({ configuration, window })
      break
    default:
      raise('Web3Mock: Unknown wallet!')
  }
}

let mockBlockchain = ({ blockchain, configuration, window, provider }) => {
  if(supported.evm.includes(blockchain)) {
    return spy(mockEvm({ blockchain, configuration, window, provider }))
  } else if(supported.solana.includes(blockchain)) {
    return spy(mockSolana({ blockchain, configuration, window, provider }))
  } else {
    raise('Web3Mock: Unknown blockchain!')
  }
}

let mock = (configuration, call) => {
  preflight(configuration)

  let window = getWindow(configuration)
  let blockchain = getBlockchain(configuration)
  let provider = configuration.provider
  let mock

  if (configuration.transaction) {
    configuration.transaction._id = getRandomTransactionHash()
  }
  if (blockchain) { mock = mockBlockchain({ blockchain, configuration, window, provider }) }
  if (configuration.wallet) { mockWallet({ configuration, window }) }
  if (configuration.require) { requireMock(configuration.require) }
  if (provider) { provider._blockchain = blockchain }
  mocks.unshift(mock)

  return mock
}

export default mock
