import getTransactionByHash from './transaction/getTransactionByHash'
import getTransactionReceipt from './transaction/getTransactionReceipt'
import raise from '../../raise'
import { balance } from './balance'
import { Blockchain } from '@depay/web3-blockchains'
import { call } from './call'
import { estimate } from './estimate'
import { ethers } from 'ethers'
import { getAccounts } from './accounts'
import { getCurrentBlock } from '../../block'
import { getCurrentNetwork } from '../../network'
import { sign } from './sign'
import { switchNetwork, addNetwork } from './network'
import { transaction } from './transaction'

let request = ({ blockchain, request, provider }) => {

  if(blockchain == undefined && provider?._blockchain) {
    blockchain = provider._blockchain
  } else if(blockchain == undefined) {
    blockchain = getCurrentNetwork()
  }

  switch (request.method) {
    case 'eth_chainId':
      return Promise.resolve(Blockchain.findByName(blockchain).id)
      break

    case 'eth_getBalance':
      return balance({ blockchain, params: request.params[0], provider })
      break

    case 'net_version':
      return Promise.resolve(Blockchain.findByName(blockchain).networkId)
      break

    case 'eth_requestAccounts':
    case 'eth_accounts':
      return getAccounts({ blockchain, provider })
      break

    case 'eth_estimateGas':
      let params = request.params ? request.params[0] : undefined
      return estimate({ blockchain, params: params, provider })
      break

    case 'eth_blockNumber':
      return Promise.resolve(ethers.BigNumber.from(getCurrentBlock())._hex)
      break

    case 'eth_call':
      return call({ blockchain, params: request.params[0], provider })
      break

    case 'eth_sendTransaction':
      return transaction({ blockchain, params: request.params[0], provider })
      break

    case 'eth_getTransactionByHash':
      return getTransactionByHash(request.params[0])
      break

    case 'eth_getTransactionReceipt':
      return getTransactionReceipt(request.params[0])
      break

    case 'eth_getTransactionCount':
      return Promise.resolve(ethers.BigNumber.from('0')._hex)
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
      return sign({ blockchain, params: request.params, provider })
      break

    default:
      raise('Web3Mock request: Unknown request method ' + request.method + '!')
  }
}

export { request }
