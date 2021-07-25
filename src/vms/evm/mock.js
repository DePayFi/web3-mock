// https://docs.metamask.io/guide/ethereum-provider.html

import { ethers } from 'ethers'
import { on } from './on'
import { request } from './request'

let mock = ({ blockchain, configuration, window, provider }) => {
  if (provider) {
    if (provider.send) {
      provider.send = (method, params) =>
        request({ blockchain, provider, request: { method: method, params: params } })
    }
    if (provider.sendTransaction) {
      provider.sendTransaction = (method, params) =>
        request({ blockchain, provider, request: { method: method, params: params } })
    }
  } else {
    window.ethereum = {
      ...window.ethereum,
      on,
      request: (configuration) => {
        return request({
          blockchain,
          request: configuration,
          provider: new ethers.providers.Web3Provider(window.ethereum),
        })
      },
    }
  }

  return configuration
}

export { mock }
