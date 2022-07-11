import raise from '../../raise'
import normalize from '../../normalize'
import { findMock, findAnyMockForThisAddress } from './findMock'
import { encode, getContractFunction, getContractArguments } from './data'

let callMock = ({ mock, params, provider })=> {
  mock.calls.add(params)
  if (mock.request.return instanceof Error) {
    return Promise.reject({ 
      error: {
        message: mock.request.return.message
      }
    })
  } else {
    return Promise.resolve(
      encode({ result: mock.request.return, api: mock.request.api, params, provider })
    )
  }
}

let call = function ({ blockchain, params, block, provider }) {
  let mock = findMock({ type: 'request', params, block, provider })

  if (mock) {
    if(mock.request.delay) {
      return new Promise((resolve)=>{
        setTimeout(()=>resolve(callMock({ mock, params, provider })), mock.request.delay)
      })
    } else {
      return callMock({ mock, params, provider })
    }
  } else {
    mock = findAnyMockForThisAddress({ type: 'request', params })
    if (mock && mock.request?.api) {
      raise(
        'Web3Mock: Please mock the request: ' +
        JSON.stringify({
          blockchain,
          request: getCallToBeMock({ mock, params, provider }),
        })
      )
    } else {
      raise('Web3Mock: Please mock the request to: ' + params.to)
    }
  }
}

let getCallToBeMock = ({ mock, params, provider }) => {
  let address = params.to
  let api = mock.request.api
  let contractFunction = getContractFunction({ data: params.data, address, api, provider })
  let contractArguments = getContractArguments({ params, api, provider })

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    method: contractFunction.name,
    return: 'Your Value',
  }

  if (contractArguments && contractArguments.length) {
    if (Array.isArray(contractArguments) && contractArguments.length === 1) {
      toBeMocked['params'] = normalize(contractArguments[0])
    } else {
      toBeMocked['params'] = contractArguments.map((argument) => normalize(argument))
    }
  }

  return toBeMocked
}

export { call }
