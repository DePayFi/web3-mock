import normalize from '../../../helpers/normalize'
import { ethers } from 'ethers'

let mocks

let mockCalls = function (configurations) {
  mocks = {}
  if (configurations === undefined) {
    return
  }
  let configurationWithLowerCaseAddress = {}
  for (const [address, configuration] of Object.entries(configurations)) {
    configurationWithLowerCaseAddress[normalize(address)] = configuration
  }
  Object.assign(mocks, configurationWithLowerCaseAddress)
}

let call = function ({ params, window }) {
  let callParams = params[0]
  let address = normalize(callParams.to)
  if (mocks[address] === undefined) {
    throw 'Web3Mock Ethereum calls: Please mock the contract at: ' + address
  } else if (mocks[address].abi === undefined) {
    throw 'Web3Mock Ethereum calls: Please mock the abi of the contract at: ' + address
  } else {
    let data = callParams.data
    let methodSelector = data.split('000000000000000000000000')[0]
    let contract = new ethers.Contract(
      address,
      mocks[address].abi,
      new ethers.providers.Web3Provider(window.ethereum),
    )

    let contractFunction = contract.interface.getFunction(methodSelector)
    if (mocks[address][contractFunction.name]) {
      let callMock = mocks[address][contractFunction.name]
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
                'Web3Mock Ethereum calls: Mock the following contract call: { "' +
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
        'Web3Mock Ethereum calls: Mock the following contract call: { "' +
        address +
        '":' +
        ' { "' +
        contractFunction.name +
        '" : "Your Value" } }'
      )
    }
  }
}

export { call, mockCalls }
