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
    if (mock.call == undefined) {
      return
    }
    if (normalize(mock.call.address) !== normalize(address)) {
      return
    }
    let data = params.data
    let methodSelector = data.split('000000000000000000000000')[0]
    let contract = new ethers.Contract(address, mock.call.api, provider)
    let contractFunction = contract.interface.getFunction(methodSelector)
    if (mock.call.method !== contractFunction.name) {
      return
    }
    if (mock.call.params) {
      let callArguments = getCallArguments({ contract, contractFunction, data })

      if (
        Array.isArray(mock.call.params) == false &&
        callArguments.length == 1 &&
        normalize(mock.call.params) != normalize(callArguments[0])
      ) {
        return
      }

      if (
        Array.isArray(mock.call.params) &&
        JSON.stringify(callArguments.map((argument) => normalize(argument))) !==
          JSON.stringify(mock.call.params.map((argument) => normalize(argument)))
      ) {
        return
      }
    }
    return mock
  })
}

let getContract = ({ address, api, provider }) => {
  return new ethers.Contract(address, api, provider)
}

let getContractFunction = ({ data, contract }) => {
  let methodSelector = data.split('000000000000000000000000')[0]
  return contract.interface.getFunction(methodSelector)
}

let getCallArguments = ({ contract, contractFunction, data }) => {
  return contract.interface.decodeFunctionData(contractFunction, data)
}

let findAnyMockForAddress = (address) => {
  return mocks.find((mock) => {
    if (normalize(mock?.call?.address) !== normalize(address)) {
      return
    }
    return mock
  })
}

let getCallToMock = ({ callArguments, params, contractFunction }) => {
  let call = {
    name: contractFunction.name,
    return: 'Your Value',
  }

  if (callArguments && callArguments.length) {
    if (Array.isArray(callArguments) && callArguments.length === 1) {
      call['params'] = normalize(callArguments[0])
    } else {
      call['params'] = callArguments.map((argument) => normalize(argument))
    }
  }

  return call
}

let call = function ({ params, provider }) {
  let address = normalize(params.to)
  let mock = findMockedCall(address, params, provider)
  let data = params.data
  if (mock) {
    mock.calls.add(params)
    let contract = getContract({ address, api: mock.call.api, provider })
    let contractFunction = getContractFunction({ data, contract })
    let callArguments = getCallArguments({ contract, contractFunction, data })
    let result = mock.call.return
    let encodedResult = contract.interface.encodeFunctionResult(contractFunction.name, [result])
    return Promise.resolve(encodedResult)
  } else {
    mock = findAnyMockForAddress(address)
    if (mock?.call?.api) {
      let contract = getContract({ address, api: mock.call.api, provider })
      let contractFunction = getContractFunction({ data, contract })
      let callArguments = getCallArguments({ contract, contractFunction, data })
      throw (
        'Web3Mock: Please mock the contract call: ' +
        JSON.stringify({
          blockchain: 'ethereum',
          call: getCallToMock({ callArguments, params, contractFunction }),
        })
      )
    } else {
      throw 'Web3Mock: Please mock the contract at: ' + address
    }
  }
}

export { call, mockCall }
