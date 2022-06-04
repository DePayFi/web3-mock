import normalize from '../../normalize'
import { anything, anythingMatch, anythingDeepMatch } from '../../anything'
import { ethers } from 'ethers'
import { getContractArguments, getContractFunction } from './data'
import { mocks } from '../../mocks'

let mockIsNotAnObject = (mock) => {
  return typeof mock !== 'object'
}

let mockHasWrongType = (mock, type) => {
  return mock[type] == undefined
}

let mockHasWrongBlockchain = (mock, blockchain) => {
  if(blockchain == undefined) { return false }
  return mock.blockchain != blockchain
}

let mockHasWrongProvider = (mock, provider) => {
  if(mock.provider == undefined) { return false }
  return mock.provider != provider
}

let mockHasWrongTransactionData = (mock, type, params) => {
  return (
    (mock[type].to && normalize(params.to) !== normalize(mock[type].to)) ||
    (mock[type].from && normalize(params.from) !== normalize(mock[type].from)) ||
    (mock[type].value &&
      ethers.BigNumber.from(params.value).toString() !== normalize(mock[type].value))
  )
}

let mockHasWrongBalanceData = (mock, type, params) => {
  return mock[type].for && normalize(params) !== normalize(mock[type].for)
}

let mockHasWrongToAddress = (mock, type, params) => {
  return normalize(mock[type].to) !== normalize(params?.to)
}

let mockDataDoesNotMatchSingleArgument = (mock, type, contractArguments) => {
  return (
    Array.isArray(mock[type].params) == false &&
    contractArguments.length == 1 &&
    (
      normalize(mock[type].params) != normalize(contractArguments[0]) && 
      normalize(Object.values(mock[type].params)[0]) != normalize(contractArguments[0])
    ) &&
    !anythingMatch({ contractArguments, mockParams: mock[type].params })
  )
}

let mockDataDoesNotMatchArrayArgument = (mock, type, contractArguments) => {
  return (
    Array.isArray(mock[type].params) &&
    JSON.stringify(contractArguments.map((argument) => normalize(argument))) !==
      JSON.stringify(mock[type].params.map((argument) => normalize(argument))) &&
    !anythingMatch({ contractArguments, mockParams: mock[type].params })
  )
}

let mockedArgumentsDoMatch = (mock, type, contractArguments) => {
  if (mock[type].params == undefined) {
    return true
  }
  if (mock[type].params == anything) {
    return true
  }

  let isDeepAnythingMatch = anythingDeepMatch({ contractArguments, mockParams: mock[type].params })

  return Object.keys(mock[type].params).every((key) => {
    if (mock[type].params && mock[type].params[key]) {
      return (
        JSON.stringify(normalize(mock[type].params[key])) ==
          JSON.stringify(normalize(contractArguments[key])) || isDeepAnythingMatch
      )
    } else {
      return true
    }
  })
}

let mockDataDoesNotMatchObjectArugment = (mock, type, contractArguments) => {
  return (
    Array.isArray(mock[type].params) == false &&
    normalize(mock[type].params) != normalize(contractArguments[0]) &&
    !mockedArgumentsDoMatch(mock, type, contractArguments) &&
    !anythingMatch({ contractArguments, mockParams: mock[type].params })
  )
}

let mockHasWrongBlock = (mock, block) => {
  if((typeof block == 'undefined' || block == 'latest') && typeof mock.block == 'undefined'){ return false }
  if(typeof mock.block == 'undefined') { return true }
  return ethers.utils.hexlify(mock.block) != block
}

let mockHasWrongData = (mock, type, params, provider) => {
  if (mock[type]?.api == undefined) {
    return
  }

  let api = mock[type].api
  let contractFunction = getContractFunction({
    data: params.data,
    address: params.to,
    api,
    provider,
  })

  if (mock[type].method !== contractFunction.name) {
    return true
  }

  let contractArguments = getContractArguments({ params, api, provider })

  if (mockDataDoesNotMatchSingleArgument(mock, type, contractArguments)) {
    return true
  }
  if (mockDataDoesNotMatchArrayArgument(mock, type, contractArguments)) {
    return true
  }
  if (mockDataDoesNotMatchObjectArugment(mock, type, contractArguments)) {
    return true
  }
}

let mockHasWrongNetworkAction = (mock, type, params) => {
  if(type != 'network') { return false }
  return Object.keys(mock.network)[0] != Object.keys(params)[0]
}

let findMock = ({ type, blockchain, params, block, provider }) => {
  return mocks.find((mock) => {
    if (mockIsNotAnObject(mock)) {
      return
    }
    if (mockHasWrongBlockchain(mock, blockchain)) {
      return
    }
    if (mockHasWrongProvider(mock, provider)) {
      return
    }
    if (mockHasWrongType(mock, type)) {
      return
    }
    if (mockHasWrongTransactionData(mock, type, params)) {
      return
    }
    if (mockHasWrongBalanceData(mock, type, params)) {
      return
    }
    if (mockHasWrongToAddress(mock, type, params)) {
      return
    }
    if (mockHasWrongData(mock, type, params, provider)) {
      return
    }
    if (mockHasWrongBlock(mock, block)) {
      return
    }
    if (mockHasWrongNetworkAction(mock, type, params)) {
      return
    }

    return mock
  })
}

let findAnyMockForThisAddress = ({ type, params }) => {
  return mocks.find((mock) => {
    if (normalize(mock[type]?.to) !== normalize(params.to)) {
      return
    }
    return mock
  })
}

let findMockByTransactionHash = (hash) => {
  return mocks.find((mock) => {
    return mock?.transaction?._id == hash && (
      mock?.transaction?._confirmed || mock?.transaction?._failed
    )
  })
}

export { findMock, findAnyMockForThisAddress, findMockByTransactionHash }
