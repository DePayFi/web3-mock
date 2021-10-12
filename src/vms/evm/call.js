import raise from '../../raise'
import normalize from '../../normalize'
import { findMock, findAnyMockForThisAddress } from './findMock'
import { encode, getContractFunction, getContractArguments } from './data'

let callMock = ({ mock, params, provider })=> {
  mock.calls.add(params)
  if (mock.call.return instanceof Error) {
    return Promise.reject(mock.call.return)
  } else {
    return Promise.resolve(
      encode({ result: mock.call.return, api: mock.call.api, params, provider })
    )
  }
}

let call = function ({ blockchain, params, provider }) {
  let mock = findMock({ type: 'call', params, provider })

  if (mock) {
    if(mock.call.delay) {
      return new Promise((resolve)=>{
        setTimeout(()=>resolve(callMock({ mock, params, provider })), mock.call.delay)
      })
    } else {
      return callMock({ mock, params, provider })
    }
  } else {
    mock = findAnyMockForThisAddress({ type: 'call', params })
    if (mock && mock.call?.api) {
      raise(
        'Web3Mock: Please mock the contract call: ' +
        JSON.stringify({
          blockchain,
          call: getCallToBeMock({ mock, params, provider }),
        })
      )
    } else {
      raise('Web3Mock: Please mock the contract call to: ' + params.to)
    }
  }
}

let getCallToBeMock = ({ mock, params, provider }) => {
  let address = params.to
  let api = mock.call.api
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
