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

let getResult = (methodName, params, callArguments, address) => {
  if (callArguments === undefined || callArguments.length === 0) {
    return params
  }
  if (typeof params === 'object' && !Array.isArray(params)) {
    if (callArguments.length === 1) {
      return params[callArguments[0]]
    } else {
      let mappedCallArguments = callArguments.map((argument) => normalize(argument))
      params = params[mappedCallArguments]
      if (params === undefined) {
        throw (
          'Web3Mock: Please mock the following contract call: ' +
          JSON.stringify({
            call: {
              address: address,
              api: ['...'],
              [methodName]: {
                [mappedCallArguments]: 'Your Value',
              },
            },
          })
        )
      } else {
        return params
      }
    }
  }
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
  if (callArguments !== undefined && callArguments.length === 0) {
    callArguments = undefined
  } else if (Array.isArray(params) && callArguments.length === 1) {
    callArguments = callArguments[0]
  }

  if (callArguments) {
    return {
      [contractFunction.name]: {
        [callArguments]: 'Your Value',
      },
    }
  } else {
    return {
      [contractFunction.name]: 'Your Value',
    }
  }
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
    let result = getResult(
      contractFunction.name,
      mock.call[contractFunction.name],
      callArguments,
      address,
    )
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
