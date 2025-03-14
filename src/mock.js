/*#if _EVM

import { mock as mockEvm } from './platforms/evm/mock'

/*#elif _SVM

import { mock as mockSolana } from './platforms/svm/mock'

//#else */

import { mock as mockEvm } from './platforms/evm/mock'
import { mock as mockSolana } from './platforms/svm/mock'

//#endif

import { getRandomTransactionHash } from './transaction.js'
import raise from './raise'
import { getWindow } from './window'
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
  if(supported.evm.includes(configuration.blockchain)) {
    if (
      typeof configuration[type] == 'undefined' ||
      typeof configuration[type].method == 'undefined'
    ) {
      return false
    }
    return configuration[type] && configuration[type]?.api === undefined
  } else if (supported.solana.includes(configuration.blockchain)) {
    if(type == 'transaction') {
      return configuration.transaction?.instructions?.every((instruction)=>!instruction.api)
    } else if(type == 'simulate') {
      return configuration.simulate?.instructions?.every((instruction)=>!instruction.api)
    } else {
      return false
    }
  }
}

let apiMissingErrorText = (type, configuration) => {
  let configurationDuplicate = configuration
  if(configuration.provider) { configurationDuplicate.provider = "PROVIDER" }

  let suggestedConfiguration
  if(supported.evm.includes(configuration.blockchain)) {
    suggestedConfiguration = Object.assign(configurationDuplicate, {
      [type]: Object.assign(configurationDuplicate[type], { api: ['PLACE API HERE'] }),
    })
  } else if (supported.solana.includes(configuration.blockchain)) {
    suggestedConfiguration = configurationDuplicate
    if(type == 'transaction') {
      suggestedConfiguration.transaction.instructions = suggestedConfiguration.transaction.instructions.map((instruction)=>Object.assign(instruction, { api: 'PLACE API HERE' }))
    } else if(type == 'simulate'){
      suggestedConfiguration.simulate.instructions = suggestedConfiguration.simulate.instructions.map((instruction)=>Object.assign(instruction, { api: 'PLACE API HERE' }))
    }
  }
  return (
    'Web3Mock: Please provide the api for the ' +
    type +
    ': ' +
    JSON.stringify(suggestedConfiguration)
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
  } else if (apiIsMissing('simulate', configuration)) {
    raise(apiMissingErrorText('simulate', configuration))
  } else if (apiIsMissing('estimate', configuration)) {
    raise(apiMissingErrorText('estimate', configuration))
  }
}

let spy = (mock) => {
  if (typeof mock != 'object') {
    return mock
  }
  
  let spy = ()=>{}
  if(mock) { Object.keys(mock).forEach((key)=>{ spy[key] = mock[key] }) }

  let calls = []
  spy.callCount = 0
  mock.calls = spy.calls = {
    add: (call) => {
      spy.callCount++
      calls.push(call)
    },
    all: () => calls,
    count: () => calls.length,
  }
  spy.getCalls = (a)=>{ return calls }
  spy.getCall = ()=>{ return calls[calls.length-1] }
  spy.calledWithExactly = ()=>{}
  spy.printf = (string)=> { 
    string = string.replace("%n", "Web3Mock")
    string = string.replace("%C", calls.map((call)=>{return JSON.stringify(call)}).join("\n"))
    return string
  }
  spy.called = ()=> { return calls.length > 1 }
  spy.calledOnce = ()=> { return calls.length == 1 }
  return spy
}

let mockWallet = ({ blockchain, configuration, window }) => {
  let wallet = configuration.wallet
  switch (wallet) {
    case 'metamask':
      window.ethereum = window._ethereum
      window.ethereum.isMetaMask = true
      break
    case 'coinbase':
      window.ethereum = window._ethereum
      window.ethereum.isCoinbaseWallet = true
      window.ethereum.isWalletLink = true
      break
    case 'phantom':
      window.solana = window._solana
      window.solana.isPhantom = true
      window.phantom = window.solana
      break
    case 'walletconnect':
      mockWalletConnect({ configuration, window })
      break
    case 'walletlink':
      mockWalletLink({ configuration, window })
      break
    default:
      if(supported.evm.includes(blockchain)) {
        window.ethereum = window._ethereum
      } else if(supported.solana.includes(blockchain)) {
        window.solana = window._solana
      }
  }
}

let mockBlockchain = ({ blockchain, configuration, window, provider }) => {
  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return mockEvm({ blockchain, configuration, window, provider })
    
    /*#elif _SVM

    /*#else */
    
    return mockEvm({ blockchain, configuration, window, provider })
    
    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM

    /*#elif _SVM

    return mockSolana({ blockchain, configuration, window, provider })

    /*#else */
    
    return mockSolana({ blockchain, configuration, window, provider })
    
    //#endif
    
  } else {
    raise('Web3Mock: Unknown blockchain!')
  }
}

let mock = (configuration, call) => {
  preflight(configuration)

  let window = getWindow(configuration)
  let blockchain = getBlockchain(configuration)
  let mock

  if (configuration.transaction) {
    configuration.transaction._id = getRandomTransactionHash(blockchain)
  }
  
  (configuration.providers || [configuration.provider]).forEach((provider)=>{
    if(provider) { provider._blockchain = blockchain }
    mock = mockBlockchain({ blockchain, configuration, window, provider })
    mocks.unshift(mock)
  })
  
  mockWallet({ blockchain, configuration, window })

  if (configuration.require) { requireMock(configuration.require) }

  return spy(mock)
}

export default mock
