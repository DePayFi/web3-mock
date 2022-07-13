import raise from '../../raise'
import { CONSTANTS } from '@depay/web3-constants'
import { findMock, findAnyMockForThisAddress } from './findMock'
import { PublicKey, Buffer, BN } from '@depay/solana-web3.js'

let callMock = ({ blockchain, mock, params, provider })=> {
  mock.calls.add(params)

  if (mock.request.return instanceof Error) {
    return Promise.reject(mock.request.return.message)
  } else {
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
      } else if (typeof value == 'boolean') {
        response[key] = value
      } else {
        raise(`Web3Mock: Unknown value type ${value}`)
      }
    })

    let buffer = Buffer.alloc(mock.request.api.span)
    mock.request.api.encode(response, buffer)

    return Promise.resolve(
      [buffer.toString('base64'), 'base64']
    )
  }
}

let responseData = function ({ blockchain, provider, method, params }) {
  let mock = findMock({ blockchain, type: 'request', params, provider })

  if(mock) {
    if(mock.request.delay) {
      return new Promise((resolve)=>{
        setTimeout(()=>resolve(callMock({ blockchain, mock, params, provider })), mock.request.delay)
      })
    } else {
      return callMock({ blockchain, mock, params, provider })
    }

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
