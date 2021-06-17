// https://docs.metamask.io/guide/ethereum-provider.html

import { ethers } from 'ethers'
import { mockCalls } from './request/call'
import { mockTransactions } from './request/transactions'
import { on, resetEvents, triggerEvent } from './on'
import { request } from './request'

let Ethereum = ({ configuration, window, provider }) => {
  mockCalls(configuration?.calls)
  mockTransactions(configuration?.transactions)
  resetEvents()

  if (provider) {
    if (provider.send) {
      provider.send = (method, params) =>
        request({ provider, request: { method: method, params: params } })
    }
    if (provider.sendTransaction) {
      provider.sendTransaction = (method, params) =>
        request({ provider, request: { method: method, params: params } })
    }
  } else {
    window.ethereum = {
      ...window.ethereum,
      on,
      request: (configuration) => {
        return request({
          request: configuration,
          provider: new ethers.providers.Web3Provider(window.ethereum),
        })
      },
    }
  }

  return Ethereum
}

Ethereum.trigger = triggerEvent

export default Ethereum
