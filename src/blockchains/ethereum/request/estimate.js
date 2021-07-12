import normalize from '../../../normalize'
import { ethers } from 'ethers'
import { findMock, findAnyMockForThisAddress } from '../mocks/findMock'
import { getContractFunction, getContractArguments } from '../data'

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
  }

  let transactionMock = findMock({ type: 'transaction', params, provider })
  if (transactionMock) {
    return defaultEstimate
  }

  let mock = findAnyMockForThisAddress({ type: 'estimate', params })

  if (mock && mock.estimate?.api) {
    throw (
      'Web3Mock: Please mock the estimate: ' +
      JSON.stringify({
        blockchain: 'ethereum',
        estimate: getEstimateToBeMocked({ mock, params, provider }),
      })
    )
  } else {
    return defaultEstimate
  }
}

let getEstimateToBeMocked = ({ mock, params, provider }) => {
  let address = params.to
  let api = mock.estimate.api
  let contractFunction = getContractFunction({ data: params.data, address, api, provider })
  let contractArguments = getContractArguments({ params, api, provider })

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    method: contractFunction.name,
    return: 'ESTIMATED GAS',
  }

  if (contractArguments && contractArguments.length) {
    let paramsToBeMocked = {}
    Object.keys(contractArguments).forEach((key) => {
      if (key.match(/\D/)) {
        paramsToBeMocked[key] = normalize(contractArguments[key])
      }
    })
    toBeMocked['params'] = paramsToBeMocked
  }

  return toBeMocked
}

export { estimate }
