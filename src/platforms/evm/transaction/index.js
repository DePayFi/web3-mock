import normalize from '../../../normalize'
import raise from '../../../raise'
import { findMock, findAnyMockForThisAddress } from '../findMock'
import { getContractFunction, getContractArguments } from '../data'

let transaction = ({ blockchain, params, provider }) => {
  let mock = findMock({ type: 'transaction', params, provider })
  if (mock) {
    mock.calls.add(params)
    if(params && params.from) { mock._from = params.from }

    if(mock.transaction.delay) {
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          if (mock.transaction.return instanceof Error) {
            reject(mock.transaction.return)
          } else {
            resolve(mock.transaction._id)
          }
        }, mock.transaction.delay)
      })
    } else {
      if (mock.transaction.return instanceof Error) {
        return Promise.reject(mock.transaction.return)
      } else {
        return Promise.resolve(mock.transaction._id)
      }
    }

  } else {
    mock = findAnyMockForThisAddress({ type: 'transaction', params })
    if (mock && mock.transaction?.api) {
      raise(
        'Web3Mock: Please mock the transaction: ' +
        JSON.stringify({
          blockchain,
          transaction: getTransactionToBeMocked({ mock, params, provider }),
        })
      )
    } else {
      raise('Web3Mock: Please mock the transaction to: ' + params.to)
    }
  }
}

let getTransactionToBeMocked = ({ mock, params, provider }) => {
  let address = params.to
  let api = mock.transaction.api
  let contractFunction = getContractFunction({ data: params.data, address, api, provider })
  let contractArguments = getContractArguments({ params, api, provider })

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    method: contractFunction.name,
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

export { transaction }
