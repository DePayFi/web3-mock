import { ethers } from 'ethers'
import { call, mockCalls } from './call'

let request = ({ request, window }) => {
  switch (request.method) {

    case 'eth_chainId':
      return Promise.resolve('0x1')
    break

    case 'eth_getBalance':
      return Promise.resolve(ethers.BigNumber.from('0'))
    break

    case 'net_version':
      return Promise.resolve(1)
    break

    case 'eth_requestAccounts':
    case 'eth_accounts':
      return Promise.resolve([])
    break

    case 'eth_estimateGas':
      return Promise.resolve('0x2c4a0')
    break

    case 'eth_blockNumber':
      return Promise.resolve('0x5daf3b')
    break

    case 'eth_call':
      return call({ params: request.params, window })
    break

    default:
      throw 'Web3Mock Ethereum request: Unknown request method!'
  }
}

export { request, mockCalls }
