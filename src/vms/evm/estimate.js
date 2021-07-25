import normalize from '../../normalize'
import { ethers } from 'ethers'
import { findMock, findAnyMockForThisAddress } from './findMock'
import { getContractFunction, getContractArguments } from './data'
import { required } from '../../require'

let throwSuggestedMock = ({ blockchain, mock, params, provider }) => {
  throw (
    'Web3Mock: Please mock the estimate: ' +
    JSON.stringify({
      blockchain,
      estimate: getEstimateToBeMocked({ mock, params, provider }),
    })
  )
}

let estimate = ({ blockchain, params, provider }) => {
  let defaultEstimate = Promise.resolve('0x2c4a0')
  let mock

  if (params === undefined) {
    return defaultEstimate
  }

  mock = findMock({ type: 'estimate', params, provider })
  if (mock) {
    mock.calls.add(params)
    if (mock?.estimate?.return instanceof Error) {
      return Promise.reject(mock.estimate.return)
    } else if (mock.estimate?.return) {
      return Promise.resolve(ethers.BigNumber.from(mock.estimate.return))
    } else {
      return defaultEstimate
    }
  } else if (required.includes('estimate')) {
    return throwSuggestedMock({ blockchain, params, provider })
  }

  mock = findMock({ type: 'transaction', params, provider })
  if (mock) {
    return defaultEstimate
  }

  mock = findAnyMockForThisAddress({ type: 'estimate', params })
  if (mock) {
    return throwSuggestedMock({ blockchain, mock, params, provider })
  } else {
    return defaultEstimate
  }
}

let getEstimateToBeMocked = ({ mock, params, provider }) => {
  let address = params.to

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    return: 'ESTIMATED GAS',
  }

  if (mock === undefined) {
    return toBeMocked
  }

  let api = mock.estimate?.api

  if (api) {
    let contractFunction = getContractFunction({ data: params.data, address, api, provider })
    let contractArguments = getContractArguments({ params, api, provider })

    toBeMocked['method'] = contractFunction.name

    if (contractArguments && contractArguments.length) {
      let paramsToBeMocked = {}
      Object.keys(contractArguments).forEach((key) => {
        if (key.match(/\D/)) {
          paramsToBeMocked[key] = normalize(contractArguments[key])
        }
      })
      toBeMocked['params'] = paramsToBeMocked
    }
  }

  return toBeMocked
}

export { estimate }
