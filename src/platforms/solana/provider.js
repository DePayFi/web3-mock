import raise from '../../raise'
import { balance } from './balance'
import { getCurrentBlock } from '../../block'
import { responseData } from './responseData'

let request = ({ blockchain, provider, method, params }) => {

  switch (method) {

    case 'getBalance':
      return balance({ blockchain, params: params[0], provider }).then((value)=>{ 
        return {
          jsonrpc: '2.0',
          id: '1', 
          result: { 
            context:{ apiVersion: '1.10.26', slot: 140152926 }, 
            value 
          } 
        }
      })
    break

    case 'getBlockHeight':
      return {
        jsonrpc: '2.0',
        id: '1',
        result: getCurrentBlock()
      }
    break

    case 'getAccountInfo':
      return Promise.resolve({
        jsonrpc: '2.0',
        id: '1', 
        result: {
          context:{ apiVersion: '1.10.26', slot: 140152926 }, 
          value: {
            data: responseData({ blockchain, provider, method, params }),
            executable: false,
            owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            lamports: 3361680,
            rentEpoch: 326
          },
        } 
      })
    break

    default:
      raise('Web3Mock request: Unknown request method ' + method + '!')
  }
}

export { request }
