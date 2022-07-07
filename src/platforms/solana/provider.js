import raise from '../../raise'
import { balance } from './balance'
import { rpcResponse } from './rpcResponse'
import { getCurrentBlock } from '../../block'

let request = ({ blockchain, provider, method, params }) => {

  switch (method) {

    case 'getBalance':
      return balance({ blockchain, params: params[0], provider }).then((value)=>{ 
        return rpcResponse({ value })
      })
    break

    case 'getBlockHeight':
      return rpcResponse({ result: getCurrentBlock() })
    break

    default:
      raise('Web3Mock request: Unknown request method ' + method + '!')
  }
}

export { request }
