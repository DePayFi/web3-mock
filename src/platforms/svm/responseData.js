import Blockchains from '@depay/web3-blockchains'
import raise from '../../raise'
import { findMock, findAnyMockForThisAddress } from './findMock'
import { PublicKey, Buffer, BN } from '@depay/solana-web3.js'

const NATIVE = Blockchains.findByName('solana').currency.address

let marshalValue = (value, blockchain)=>{
  if(typeof value == 'number') {
    return value
  } else if (typeof value == 'string' && value == NATIVE) {
    return new PublicKey(value)
  } else if (typeof value == 'string' && value.match(/[^0-9-]/)) {
    try {
      return new PublicKey(value)
    } catch(e) { // normal string
      return Buffer.from(value, 'utf-8')
    }
  } else if (typeof value == 'string' && !value.match(/[^0-9-]/)) {
    return new BN(value, 10)
  } else if (typeof value == 'boolean') {
    return value
  } else if (value instanceof Buffer) {
    return value
  } else if (value instanceof Array) {
    return value.map((value)=>marshalValue(value, blockchain))
  } else if (value instanceof Object) {
    let valueObject = {}
    Object.keys(value).forEach((key)=>{
      let singleValue = value[key]
      valueObject[key] = marshalValue(singleValue, blockchain)
    })
    return valueObject
  } else if (value === null) {
    return null
  } else {
    raise(`Web3Mock: Unknown value type ${value}`)
  }
}

let callMock = ({ blockchain, mock, params, provider, raw })=> {
  mock.calls.add(params)

  if (mock.request.return instanceof Error) {
    return Promise.reject(mock.request.return.message)
  } else if(raw) {
    return Promise.resolve(mock.request.return)
  } else if(!mock.request.return) {
    return Promise.resolve(mock.request.return)
  } else if(mock.request.return && mock.request.return.raw ) {

    return Promise.resolve(mock.request.return.raw)

  } else {
    let response = marshalValue(mock.request.return, blockchain)

    if(mock.request.api) {
      let buffer = Buffer.alloc(mock.request.api.span < 0 ? 1000 : mock.request.api.span)
      mock.request.api.encode(response, buffer)

      return Promise.resolve(
        [buffer.toString('base64'), 'base64']
      )
    } else {
      return Promise.resolve(response)
    }
  }
}

let responseData = function ({ blockchain, provider, method, params, raw }) {
  let mock = findMock({ blockchain, type: 'request', params, method, provider })

  if(mock) {
    if(mock.request.delay) {
      return new Promise((resolve)=>{
        setTimeout(()=>resolve(callMock({ blockchain, mock, params, provider, raw })), mock.request.delay)
      })
    } else {
      return callMock({ blockchain, mock, params, provider, raw })
    }

  } else {
    
    mock = findAnyMockForThisAddress({ type: 'request', params })
    if (mock) {
      raise(
        'Web3Mock: Please mock the request: ' +
        JSON.stringify({
          blockchain,
          request: getRequestToBeMocked({ mock, method, params, provider }),
        })
      )
    } else {
      raise('Web3Mock: Please mock the request to: ' + params[0])
    }
  }
}

let getRequestToBeMocked = ({ mock, params, method, provider }) => {
  let address = params[0]
  let api = mock.request.api

  let toBeMocked = {
    to: address,
    method: method,
    return: 'Your Value',
  }

  if(mock.api){
    toBeMocked.api = ['PLACE API HERE']
  }

  if(params[1]) {
    let requestParams = JSON.parse(JSON.stringify(params[1]))
    delete requestParams.encoding
    toBeMocked.params = requestParams
  }

  return toBeMocked
}

export { responseData }
