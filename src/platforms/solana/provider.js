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

    case 'getMinimumBalanceForRentExemption':
      return responseData({ blockchain, provider, method, params })
        .then((data)=>{
          return({
            jsonrpc: '2.0',
            id: '1', 
            result: data
          })
        })
    break

    case 'getAccountInfo':
      return responseData({ blockchain, provider, method, params })
        .then((data)=>{
          let value
          
          if(data) {
            value = {
              data,
              executable: false,
              owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              lamports: 3361680,
              rentEpoch: 326
            }
          } else {
            value = data
          }

          return({
            jsonrpc: '2.0',
            id: '1', 
            result: {
              context:{ apiVersion: '1.10.26', slot: 140152926 }, 
              value
            } 
          })
        })
    break

    case 'getProgramAccounts':
      return responseData({ blockchain, provider, method, params })
        .then((data)=>{
          return({
            jsonrpc: '2.0',
            id: '1', 
            result: data
          })
        })
    break

    case 'getTokenAccountBalance':
      return responseData({ blockchain, provider, method, params, raw: true })
        .then((value)=>{
          return({
            jsonrpc: '2.0',
            id: '1', 
            result: {
              context:{ apiVersion: '1.10.26', slot: 140152926 }, 
              value
            }
          })
        })
    break

    default:
      raise('Web3Mock request: Unknown request method ' + method + '!')
  }
}

export { request }
