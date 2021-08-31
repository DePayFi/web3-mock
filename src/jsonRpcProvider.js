import { ethers } from 'ethers'
import { request } from './vms/evm/request'

let mockJsonRpcProvider = ({ blockchain, window })=>{

  class MockedJsonRpcProvider extends ethers.providers.Web3Provider {
    
    constructor(url) {
      super(window.ethereum)
    }

    send(method, params) {
      return request({ blockchain, provider: this, request: { method: method, params: params } })
    }

    sendTransaction(method, params) {
      return request({ blockchain, provider: this, request: { method: method, params: params } })
    }
  }

  Object.defineProperty(ethers.providers, 'JsonRpcProvider', {
    get: ()=>MockedJsonRpcProvider,
  })
}

export {
  mockJsonRpcProvider
}
