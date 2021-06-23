import normalize from '../../../helpers/normalize'
import { ethers } from 'ethers'
import { mocks } from '../../../mocks'

let mockCall = (configuration)=> {
  if(configuration.abi === undefined) {
    throw 'Web3Mock: Please mock the abi of the contract at: ' + configuration.address
  }
  return configuration
}

let findMockedCall = (address, callParams, provider)=> {
  return mocks.find((mock)=>{
    if(typeof mock !== 'object') { return }
    if(normalize(mock.address) !== normalize(address)) { return }
    let data = callParams.data
    let methodSelector = data.split('000000000000000000000000')[0]
    let contract = new ethers.Contract(address, mock.abi, provider)
    let contractFunction = contract.interface.getFunction(methodSelector)
    if(!Object.keys(mock.call).includes(contractFunction.name)) { return }
    return mock
  })
}

let formatResult = (result, callArguments, address)=> {
  if (callArguments === undefined || callArguments.length === 0) { return result }
  if (typeof result === 'object' && !Array.isArray(result)) {
    if (callArguments.length === 1) {
      return result[callArguments[0]]
    } else {
      let mappedCallArguments = callArguments.map((argument) => normalize(argument))
      result = result[mappedCallArguments]
      if (result === undefined) {
        throw (
          'Web3Mock: Mock the following contract call: { "' +
          "address: "+ address +
          '"call":' +
          ' { [[' +
          mappedCallArguments.join(',') +
          ']] : "Your Value" } }'
        )
      } else {
        return result
      }
    }
  }
}

let call = function ({ params, provider }) {
  let callParams = params[0]
  let address = normalize(callParams.to)
  let mock = findMockedCall(address, callParams, provider);
  if(mock) {
    let data = callParams.data
    let methodSelector = data.split('000000000000000000000000')[0]
    let contract = new ethers.Contract(address, mock.abi, provider)
    let contractFunction = contract.interface.getFunction(methodSelector)
    let callArguments = contract.interface.decodeFunctionData(contractFunction, data)
    let result = formatResult(mock.call[contractFunction.name], callArguments, address)
    let encodedResult = contract.interface.encodeFunctionResult(
      contractFunction.name,
      [result]
    )
    return Promise.resolve(encodedResult)
  } else {
    throw('Web3Mock: Please mock the contract at: ' + address);
  }
}

export { call, mockCall }
