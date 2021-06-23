import normalize from '../../../helpers/normalize'
import { ethers } from 'ethers'

let mockedCalls = {}

let mockCall = function (configuration) {
  if (configuration === undefined) return;

  let configurationWithLowerCaseAddress = {
    [normalize(Object.keys(configuration)[0])]: Object.values(configuration)[0]
  }

  Object.assign(mockedCalls, configurationWithLowerCaseAddress)
}

let call = function ({ params, provider }) {
  let callParams = params[0]
  let address = normalize(callParams.to)
  if (mockedCalls[address] === undefined) {
    throw 'Web3Mock: Please mock the contract at: ' + address
  } else if (mockedCalls[address].abi === undefined) {
    throw 'Web3Mock: Please mock the abi of the contract at: ' + address
  } else {
    let data = callParams.data
    let methodSelector = data.split('000000000000000000000000')[0]
    let contract = new ethers.Contract(address, mockedCalls[address].abi, provider)

    let contractFunction = contract.interface.getFunction(methodSelector)
    if (mockedCalls[address][contractFunction.name]) {
      let callMock = mockedCalls[address][contractFunction.name]
      let callArguments = contract.interface.decodeFunctionData(contractFunction, data)

      if (callArguments !== undefined) {
        if (typeof callMock === 'object' && !Array.isArray(callMock)) {
          if (callArguments.length === 1) {
            callMock = callMock[callArguments[0]]
          } else {
            let mappedCallArguments = callArguments.map((argument) => normalize(argument))
            callMock = callMock[mappedCallArguments]
            if (callMock === undefined) {
              throw (
                'Web3Mock: Mock the following contract call: { "' +
                address +
                '":' +
                ' { [[' +
                mappedCallArguments.join(',') +
                ']] : "Your Value" } }'
              )
            }
          }
        }
      }

      callMock = [callMock]
      let encodedResult = contract.interface.encodeFunctionResult(contractFunction.name, callMock)
      return Promise.resolve(encodedResult)
    } else {
      throw (
        'Web3Mock: Mock the following contract call: { "' +
        address +
        '":' +
        ' { "' +
        contractFunction.name +
        '" : "Your Value" } }'
      )
    }
  }
}

export { call, mockCall }
