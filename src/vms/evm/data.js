import { ethers } from 'ethers'

let getContract = ({ address, api, provider }) => {
  return new ethers.Contract(address, api, provider)
}

let getContractFunction = ({ data, address, api, provider }) => {
  let contract = getContract({ address, api, provider })
  let methodSelector = data.split('000000000000000000000000')[0]
  try {
    return contract.interface.getFunction(methodSelector)
  } catch (error) {
    if (error.reason == 'no matching function') {
      throw 'Web3Mock: method not found in mocked api!'
    } else {
      throw error
    }
  }
}

let getContractArguments = ({ params, api, provider }) => {
  let data = params.data
  let address = params.to
  let contract = getContract({ address, api, provider })
  let contractFunction = getContractFunction({ data, address, api, provider })
  return contract.interface.decodeFunctionData(contractFunction, data)
}

let encode = ({ result, params, api, provider }) => {
  let address = params.to
  let data = params.data
  let contract = getContract({ address, api, provider })
  let contractFunction = getContractFunction({ data, address, api, provider })
  let callArguments = getContractArguments({ params, api, provider })
  return contract.interface.encodeFunctionResult(contractFunction.name, [result])
}

export { encode, getContractFunction, getContractArguments }
