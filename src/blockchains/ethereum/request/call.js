import normalize from '../../../helpers/normalize'
import { ethers } from 'ethers'
import { mocks } from '../../../mocks'

let mockCall = (configuration) => {
  if (configuration?.call?.api === undefined) {
    throw 'Web3Mock: Please mock the api of the contract at: ' + configuration?.call?.address
  }
  return configuration
}

let findMockedCall = (address, params, provider) => {
  return mocks.find((mock) => {
    if (typeof mock !== 'object') {
      return
    }
    if (normalize(mock.call.address) !== normalize(address)) {
      return
    }
    let data = params.data
    let methodSelector = data.split('000000000000000000000000')[0]
    let contract = new ethers.Contract(address, mock.call.api, provider)
    let contractFunction = contract.interface.getFunction(methodSelector)
    if (!Object.keys(mock.call).includes(contractFunction.name)) {
      return
    }
    return mock
  })
}

let formatResult = (methodName, result, callArguments, address) => {
  if (callArguments === undefined || callArguments.length === 0) {
    return result
  }
  if (typeof result === 'object' && !Array.isArray(result)) {
    if (callArguments.length === 1) {
      return result[callArguments[0]]
    } else {
      let mappedCallArguments = callArguments.map((argument) => normalize(argument))
      result = result[mappedCallArguments]
      if (result === undefined) {
        throw (
          'Web3Mock: Please mock the following contract call: ' + JSON.stringify({
            call: {
              address: address,
              api: ['...'],
              [methodName]: {
                [mappedCallArguments]: 'Your Value'
              }
            }
          })
        )
      } else {
        return result
      }
    }
  }
}

let call = function ({ params, provider }) {
  let address = normalize(params.to)
  let mock = findMockedCall(address, params, provider)
  if (mock) {
    mock.calls.add(params)
    let data = params.data
    let methodSelector = data.split('000000000000000000000000')[0]
    let contract = new ethers.Contract(address, mock.call.api, provider)
    let contractFunction = contract.interface.getFunction(methodSelector)
    let callArguments = contract.interface.decodeFunctionData(contractFunction, data)
    let result = formatResult(contractFunction.name, mock.call[contractFunction.name], callArguments, address)
    let encodedResult = contract.interface.encodeFunctionResult(contractFunction.name, [result])
    return Promise.resolve(encodedResult)
  } else {
    throw 'Web3Mock: Please mock the contract at: ' + address
  }
}

export { call, mockCall }
