// https://docs.metamask.io/guide/ethereum-provider.html

import { ethers } from 'ethers'
import { mockCall } from './request/call'
import { mockTransaction } from './request/transactions'
import { on, resetEvents, triggerEvent } from './on'
import { request } from './request'

let Ethereum = ({ configuration, window, provider }) => {
  mockCall(configuration?.call)
  mockTransaction(configuration?.transaction)
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
