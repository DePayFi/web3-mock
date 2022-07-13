import raise from '../../raise'
import { CONSTANTS } from '@depay/web3-constants'
import { findMock, findAnyMockForThisAddress } from './findMock'
import { PublicKey, Buffer, BN } from '@depay/solana-web3.js'

let responseData = function ({ blockchain, provider, method, params }) {
  let mock = findMock({ blockchain, type: 'request', params, provider })

  if(mock) {
    mock.calls.add(params)
    let response = {}
    Object.keys(mock.request.return).forEach((key)=>{
      let value = mock.request.return[key]
      if(typeof value == 'number') {
        response[key] = value
      } else if (typeof value == 'string' && value == CONSTANTS[blockchain].NATIVE) {
        response[key] = new PublicKey(value)
      } else if (typeof value == 'string' && value.match(/\D/)) {
        response[key] = new PublicKey(value)
      } else if (typeof value == 'string' && !value.match(/\D/)) {
        response[key] = new BN(value, 10)
      } else {
        raise(`Web3Mock: Unknown value type ${value}`)
      }
    })

    let buffer = Buffer.alloc(mock.request.api.span)
    mock.request.api.encode(response, buffer)

    return [buffer.toString('base64'), 'base64']

  } else {
    
    mock = findAnyMockForThisAddress({ type: 'request', params })
    if (mock && mock.request?.api) {
      raise(
        'Web3Mock: Please mock the request: ' +
        JSON.stringify({
          blockchain,
          request: getRequestToBeMocked({ mock, params, provider }),
        })
      )
    } else {
      raise('Web3Mock: Please mock the request to: ' + params[0])
    }
  }
}

let getRequestToBeMocked = ({ mock, params, provider }) => {
  let address = params[0]
  let api = mock.request.api

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    method: contractFunction.name,
    return: 'Your Value',
  }

  return toBeMocked
}

export { responseData }
