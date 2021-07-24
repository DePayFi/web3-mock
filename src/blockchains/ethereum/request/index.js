import getTransactionByHash from './transaction/getTransactionByHash'
import getTransactionReceipt from './transaction/getTransactionReceipt'
import { balance } from './balance'
import { call } from './call'
import { estimate } from './estimate'
import { ethers } from 'ethers'
import { getCurrentBlock } from '../../../block'
import { transaction } from './transaction'

let request = ({ request, provider }) => {
  switch (request.method) {
    case 'eth_chainId':
      return Promise.resolve('0x1')
      break

    case 'eth_getBalance':
      return balance({ params: request.params[0], provider })
      break

    case 'net_version':
      return Promise.resolve(1)
      break

    case 'eth_requestAccounts':
    case 'eth_accounts':
      return Promise.resolve(['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'])
      break

    case 'eth_estimateGas':
      let params = request.params ? request.params[0] : undefined
      return estimate({ params: params, provider })
      break

    case 'eth_blockNumber':
      return Promise.resolve(ethers.BigNumber.from(getCurrentBlock())._hex)
      break

    case 'eth_call':
      return call({ params: request.params[0], provider })
      break

    case 'eth_sendTransaction':
      return transaction({ params: request.params[0], provider })
      break

    case 'eth_getTransactionByHash':
      return getTransactionByHash(request.params[0])
      break

    case 'eth_getTransactionReceipt':
      return getTransactionReceipt(request.params[0])
      break

    default:
      throw 'Web3Mock Ethereum request: Unknown request method ' + request.method + '!'
  }
}

export { request }
