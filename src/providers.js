import raise from './raise'
import { ethers } from 'ethers'
import { request } from './vms/evm/request'

let rpcToBlockchain = {}

let mockRpc = (url, blockchain)=>{
  rpcToBlockchain[url] = blockchain
}

let mockedAllProviders = {}

let mockJsonRpcProvider = ({ blockchain, window })=>{

  class MockedJsonRpcProvider extends ethers.providers.Web3Provider {
    
    constructor(url) {
      if(rpcToBlockchain[url] == undefined) {
        raise(`Web3Mock: Unknown RPC! Add RPC mock with: mockRpc('${url}', '<blockchain>')`)
      }
      super(window.ethereum)
      this._url = url
    }

    send(method, params) {
      return request({
        blockchain: rpcToBlockchain[this._url],
        provider: this,
        request: { method: method, params: params } 
      })
    }

    sendTransaction(method, params) {
      console.log(this._url)
      return request({
        blockchain: rpcToBlockchain[this._url],
        provider: this,
        request: { method: method, params: params }
      })
    }
  }

  Object.defineProperty(ethers.providers, 'JsonRpcProvider', {
    get: ()=>MockedJsonRpcProvider,
  })
}

let mockJsonRpcBatchProvider = ({ blockchain, window })=>{

  class MockedJsonRpcBatchProvider extends ethers.providers.Web3Provider {
    
    constructor(url) {
      if(rpcToBlockchain[url] == undefined) {
        raise(`Web3Mock: Unknown RPC! Add RPC mock with: mockRpc('${url}', '<blockchain>')`)
      }
      super(window.ethereum)
      this._url = url
    }

    send(method, params) {
      return request({
        blockchain: rpcToBlockchain[this._url],
        provider: this,
        request: { method: method, params: params } 
      })
    }

    sendTransaction(method, params) {
      console.log(this._url)
      return request({
        blockchain: rpcToBlockchain[this._url],
        provider: this,
        request: { method: method, params: params }
      })
    }
  }

  Object.defineProperty(ethers.providers, 'JsonRpcBatchProvider', {
    get: ()=>MockedJsonRpcBatchProvider,
  })
}

let mockAllProviders = ({ blockchain, window }) => {
  if(mockedAllProviders[blockchain]) { return }
  mockedAllProviders[blockchain] = true
  mockJsonRpcProvider({ blockchain, window })
  mockJsonRpcBatchProvider({ blockchain, window })
}

export {
  mockAllProviders,
  mockRpc
}
