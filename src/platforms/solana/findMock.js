import normalize from '../../normalize'
import { anything, anythingMatch, anythingDeepMatch } from '../../anything'
import { ethers } from 'ethers'
import { mocks } from '../../mocks'

let mockIsNotAnObject = (mock) => {
  return typeof mock !== 'object'
}

let mockHasWrongType = (mock, type) => {
  return mock[type] == undefined
}

let mockHasWrongMethod = (mock, method) => {
  if(mock.request && mock.request.method) { return mock.request.method != method }
  return false
}

let mockHasWrongBlockchain = (mock, blockchain) => {
  if(blockchain == undefined) { return false }
  return mock.blockchain != blockchain
}

let mockHasWrongProvider = (mock, provider) => {
  if(mock.provider == undefined) { return false }
  return mock.provider != provider
}

let mockHasWrongTransactionData = (mock, type, transaction) => {
  let requiredFrom = transaction?.message?.staticAccountKeys?.length ? transaction.message.staticAccountKeys[0].toString() : undefined

  return (
    (mock[type].from && normalize(requiredFrom) !== normalize(mock[type].from))
  )
}

let mockHasWrongTransactionInstructions = (mock, type, transaction) => {
  return (
    (mock[type]?.instructions && mock[type].instructions.some((mockedInstruction)=>{
      if(mockedInstruction?.params == anything) { return false }
      return !(transaction?.message?.compiledInstructions).some((instruction)=>{
        let instructionProgramId = transaction.message.staticAccountKeys[instruction.programIdIndex].toString()
        if(normalize(instructionProgramId) != normalize(mockedInstruction.to)) { return false }
        let decodedInstructionData
        try { decodedInstructionData = mockedInstruction.api.decode(instruction.data) } catch {}
        if(!decodedInstructionData) { return false }
        if(Object.keys(decodedInstructionData).some((key)=>{
          if(!mockedInstruction.params) { return false }
          if(mockedInstruction.params[key] == anything) { return false }
          return mockedInstruction.params[key] != decodedInstructionData[key]
        })) { return false }

        return true
      })
    }))
  )
}

let mockHasWrongBalanceData = (mock, type, params) => {
  return mock[type].for && normalize(params) !== normalize(mock[type].for)
}

let mockHasWrongToAddress = (mock, type, params) => {
  if(mock[type].to == undefined) { return false }
  return normalize(mock[type].to) !== normalize(params[0])
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
  return ethers.utils.hexValue(mock.block) != block
}

let mockHasWrongParams = (mock, type, params, provider) => {
  if(mock.request == undefined) { return false }
  if(mock.request.params == undefined) { return false }

  if(params == undefined || params[1] == undefined) { return true }

  let requestParams = JSON.parse(JSON.stringify(params[1]))
  delete requestParams.encoding

  if(JSON.stringify(requestParams) != JSON.stringify(mock.request.params)) {
    return true
  }
}

let mockHasWrongNetworkAction = (mock, type, params) => {
  if(type != 'network') { return false }
  return Object.keys(mock.network)[0] != Object.keys(params)[0]
}

let findMock = ({ type, blockchain, params, method, block, provider }) => {
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
    if (mockHasWrongMethod(mock, method)) {
      return
    }
    if (mockHasWrongTransactionData(mock, type, params)) {
      return
    }
    if (mockHasWrongTransactionInstructions(mock, type, params)) {
      return
    }
    if (mockHasWrongBalanceData(mock, type, params)) {
      return
    }
    if (mockHasWrongToAddress(mock, type, params)) {
      return
    }
    if (mockHasWrongParams(mock, type, params, provider)) {
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
    if (normalize(mock[type]?.to) !== normalize(params[0])) {
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
