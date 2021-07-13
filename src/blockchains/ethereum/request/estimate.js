import normalize from '../../../normalize'
import { ethers } from 'ethers'
import { findMock, findAnyMockForThisAddress } from '../mocks/findMock'
import { getContractFunction, getContractArguments } from '../data'
import { required } from '../../../require'

let throwSuggestedMock = ({ mock, params, provider }) => {
  throw (
    'Web3Mock: Please mock the estimate: ' +
    JSON.stringify({
      blockchain: 'ethereum',
      estimate: getEstimateToBeMocked({ mock, params, provider }),
    })
  )
}

let estimate = ({ params, provider }) => {
  let defaultEstimate = Promise.resolve('0x2c4a0')

  if (params === undefined) {
    return defaultEstimate
  }

  let estimateMock = findMock({ type: 'estimate', params, provider })
  if (estimateMock) {
    estimateMock.calls.add(params)
    if (estimateMock.estimate?.return) {
      return Promise.resolve(ethers.BigNumber.from(estimateMock.estimate.return))
    } else {
      return defaultEstimate
    }
  } else if (required.includes('estimate')) {
    return throwSuggestedMock({ params, provider })
  }

  let transactionMock = findMock({ type: 'transaction', params, provider })
  if (transactionMock) {
    return defaultEstimate
  }

  let mock = findAnyMockForThisAddress({ type: 'estimate', params })
  if (mock) {
    return throwSuggestedMock({ mock, params, provider })
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
