import Blockchains from '@depay/web3-blockchains'
import getTransactionByHash from './transaction/getTransactionByHash'
import getTransactionReceipt from './transaction/getTransactionReceipt'
import raise from '../../raise'
import { balance } from './balance'
import { call } from './call'
import { code } from './code'
import { estimate } from './estimate'
import { ethers } from 'ethers'
import { getAccounts } from './accounts'
import { getCurrentBlock, getBlockData } from '../../block'
import { getCurrentNetwork } from '../../network'
import { getLogs } from './logs'
import { getTransactionCount } from './transaction/count'
import { sign } from './sign'
import { switchNetwork, addNetwork } from './network'
import { traceTransaction } from './trace'
import { transaction } from './transaction'

let request = ({ blockchain, request, provider }) => {
  let params

  // Web3js request fix (nested request)
  if(Object.keys(request.method).includes('method')) {
    request = request.method
  }

  if(blockchain == undefined && provider?._blockchain) {
    blockchain = provider._blockchain
  } else if(blockchain == undefined) {
    blockchain = getCurrentNetwork()
  }

  switch (request.method) {
    case 'eth_chainId':
      return Promise.resolve(Blockchains.findByName(blockchain).id)
      break

    case 'eth_getBalance':
      return balance({ blockchain, params: (request.params instanceof Array) ? request.params[0] : request.params, provider })
      break

    case 'net_version':
      return Promise.resolve(Blockchains.findByName(blockchain).networkId)
      break

    case 'eth_requestAccounts':
    case 'eth_accounts':
      return getAccounts({ blockchain, provider })
      break

    case 'eth_estimateGas':
      params = request.params ? ((request.params instanceof Array) ? request.params[0] : request.params) : undefined
      return estimate({ blockchain, params, provider })
      break

    case 'eth_blockNumber':
    case 'eth_getBlockNumber':
      return Promise.resolve("0x" + BigInt(getCurrentBlock()).toString(16))
      break

    case 'eth_getBlockByNumber':
      let blockNumber
      if(request.params[0] == 'latest'){
        blockNumber = getCurrentBlock()
      } else {
        blockNumber = BigInt(request.params[0].toString())
      }
      return Promise.resolve(getBlockData(parseInt(blockNumber.toString())))
      break

    case 'eth_gasPrice':
      return Promise.resolve('0x12fee89674')
      break

    case 'eth_call':
      if(request.params instanceof Array) {
        return call({ blockchain, params: request.params[0], block: request.params[1], provider })
      } else if(typeof request.params == 'object') {
        return call({ blockchain, params: request.params.transaction, block: request.params.blockTag, provider })
      }
      break

    case 'eth_sendTransaction':
      return transaction({ blockchain, params: request.params[0], provider })
      break

    case 'eth_getTransactionByHash':
    case 'eth_getTransaction':
      return getTransactionByHash((request.params instanceof Array) ? request.params[0] : request.params.transactionHash)
      break

    case 'eth_getTransactionReceipt':
      return getTransactionReceipt((request.params instanceof Array) ? request.params[0] : request.params.transactionHash)
      break

    case 'eth_getTransactionCount':
      params = request.params ? ((request.params instanceof Array) ? request.params[0] : request.params.address) : undefined
      return Promise.resolve(getTransactionCount(params))
      break

    case 'eth_subscribe':
      return Promise.resolve()
      break

    case 'wallet_switchEthereumChain':
      return switchNetwork({ blockchain, id: request.params[0].chainId, provider })
      break

    case 'wallet_addEthereumChain':
      return addNetwork({ blockchain, params: request.params[0], provider })
      break

    case 'eth_sign':
    case 'personal_sign':
    case 'eth_signTypedData':
    case 'eth_signTypedData_v1':
    case 'eth_signTypedData_v2':
    case 'eth_signTypedData_v3':
    case 'eth_signTypedData_v4':
      return sign({ blockchain, params: request.params, provider })
      break

    case 'eth_getCode':
      return code({ blockchain, params: request.params, provider })
      break

    case 'eth_getGasPrice':
      return Promise.resolve(ethers.toBeHex(13370000000))

    case 'eth_getLogs':
      params = request.params ? ((request.params instanceof Array) ? request.params[0] : request.params) : undefined
      return getLogs({ blockchain, params, provider })
    
    case 'debug_traceTransaction':
      return traceTransaction({ blockchain, params: request.params, provider })

    default:
      raise('Web3Mock request: Unknown request method ' + request.method + '!')
  }
}

export { request }
