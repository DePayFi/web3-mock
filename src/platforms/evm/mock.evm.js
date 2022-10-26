import { on, removeListener } from './events'
import { request } from './request.evm'
import { setCurrentNetwork } from '../../network'
import { ethers } from 'ethers'

let mock = ({ blockchain, configuration, window, provider }) => {

  setCurrentNetwork(blockchain)

  if (provider) {
    if (provider.perform) {
      provider.perform = (method, params) =>{
        return request({ provider, request: { method: `eth_${method}`, params: params } })
      }
    }
    if (provider.send) {
      provider.send = (method, params) =>
        request({ provider, request: { method: method, params: params } })
    }
    if (provider.sendTransaction) {
      provider.sendTransaction = (method, params) =>
        request({ provider, request: { method: method, params: params } })
    }
  }

  window._ethereum = {
    ...window.ethereum,
    on,
    removeListener,
    request: (payload) => {
      return request({
        request: payload,
        provider: new ethers.providers.Web3Provider(window._ethereum),
      })
    },
  }

  return configuration
}

export { mock }
