import normalize from '../../../helpers/normalize'
import { ethers } from 'ethers'
import { mocks } from '../../../mocks'

let mockTransaction = function (configuration) {
  if(configuration?.transaction?.method && configuration?.transaction?.abi === undefined) {
    throw 'Web3Mock: Please mock the abi of the contract at: ' + configuration?.transaction?.to
  }
  return configuration
}

let getContract = function ({ params, mock, provider }) {
  return new ethers.Contract(params.to, mock?.transaction?.abi, provider)
}

let getContractFunction = function ({ data, params, mock, provider }) {
  let contract = getContract({ params, mock, provider })
  let methodSelector = data.split('000000000000000000000000')[0]
  return contract.interface.getFunction(methodSelector)
}

let decodeTransactionArguments = function ({ params, mock, provider }) {
  let data = params.data
  let contract = getContract({ params, mock, provider })
  let contractFunction = getContractFunction({ data, params, mock, provider })
  if (mock?.transaction?.method && contractFunction.name != mock?.transaction?.method) {
    return
  }
  return contract.interface.decodeFunctionData(contractFunction, data)
}

let findMock = function ({ params, provider }) {
  return mocks.find((mock)=>{
    let transaction = mock.transaction
    if(typeof mock !== 'object') { return }
    if(transaction.to && normalize(transaction.to) !== normalize(params.to)) { return }
    if(transaction.from && normalize(transaction.from) !== normalize(params.from)) { return }
    if(transaction.value && normalize(transaction.value) !== ethers.BigNumber.from(params.value).toString()) { return }
    if(params.data && mock.transaction.abi) {
      let data = params.data
      let methodSelector = data.split('000000000000000000000000')[0]
      let contract = new ethers.Contract(params.to, mock.transaction.abi, provider)
      let contractFunction = contract.interface.getFunction(methodSelector)
      if(mock.transaction.method != contractFunction.name) { return }
      let transactionArguments = decodeTransactionArguments({ params, mock, provider })
      let allArgumentsMatch = Object.keys(mock?.transaction?.params).every((key) => {
        if (mock.transaction.params && mock.transaction.params[key]) {
          return (
            JSON.stringify(normalize(mock.transaction.params[key])) ==
            JSON.stringify(normalize(transactionArguments[key]))
          )
        } else {
          return true
        }
      })
      if (!allArgumentsMatch) { return }
    }
    return mock
  })
}

let transactionHash = function () {
  return '0xbb8d9e2262cd2d93d9bf7854d35f8e016dd985e7b3eb715d0d7faf7290a0ff4d'
}

let sendTransaction = function ({ params, provider }) {
  let mock = findMock({ params, provider })
  if (mock || !params.data) {
    if(mock) { mock.calls.add(params) }
    return Promise.resolve(transactionHash())
  } else {
    throw ([
      "Web3Mock: Please mock the transaction to: "+params.to,
    ].join(''))
  }
}

export { sendTransaction, mockTransaction }
