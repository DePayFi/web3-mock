import anything from '../../../anything'
import normalize from '../../../normalize'
import { ethers } from 'ethers'
import { getCurrentBlock } from '../block'
import { mocks } from '../../../mocks'

let mockTransaction = function (configuration) {
  if (configuration?.transaction?.method && configuration?.transaction?.api === undefined) {
    throw 'Web3Mock: Please mock the api of the contract at: ' + configuration?.transaction?.to
  }
  return configuration
}

let getContract = function ({ params, mock, provider }) {
  let contract = new ethers.Contract(params.to, mock?.transaction?.api, provider)
  return contract
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

let fillMockParamsWithAnything = ({ transactionArguments, mockParams }) => {
  if (typeof mockParams === 'object' && !Array.isArray(mockParams) && !mockParams._isBigNumber) {
    let filledMockParams = {}
    Object.keys(mockParams).forEach((key) => {
      filledMockParams[key] = fillMockParamsWithAnything({
        transactionArguments: transactionArguments[key],
        mockParams: mockParams[key],
      })
    })
    return filledMockParams
  } else if (Array.isArray(mockParams)) {
    return mockParams.map((element, index) => {
      return fillMockParamsWithAnything({
        transactionArguments: transactionArguments[index],
        mockParams: element,
      })
    })
  } else {
    if (mockParams === anything) {
      return normalize(transactionArguments)
    } else {
      return mockParams
    }
  }
}

let deepAnythingMatch = ({ transactionArguments, mockParams }) => {
  let filledMockParams = fillMockParamsWithAnything({ transactionArguments, mockParams })
  return Object.keys(filledMockParams).every((key) => {
    return (
      JSON.stringify(normalize(filledMockParams[key])) ==
      JSON.stringify(normalize(transactionArguments[key]))
    )
  })
}

let findMock = function ({ params, provider }) {
  return mocks.find((mock) => {
    let transaction = mock.transaction
    if (typeof mock !== 'object') {
      return
    }
    if (mock.transaction === undefined) {
      return
    }
    if (transaction.to && normalize(transaction.to) !== normalize(params.to)) {
      return
    }
    if (transaction.from && normalize(transaction.from) !== normalize(params.from)) {
      return
    }
    if (
      transaction.value &&
      normalize(transaction.value) !== ethers.BigNumber.from(params.value).toString()
    ) {
      return
    }
    if (params.data && mock.transaction.api) {
      let data = params.data
      let methodSelector = data.split('000000000000000000000000')[0]
      let contract = new ethers.Contract(params.to, mock.transaction.api, provider)
      let contractFunction = contract.interface.getFunction(methodSelector)
      if (mock.transaction.method != contractFunction.name) {
        return
      }
      let transactionArguments = decodeTransactionArguments({ params, mock, provider })
      let allArgumentsMatch

      if (mock?.transaction?.params === anything) {
        allArgumentsMatch = true
      } else {
        allArgumentsMatch = Object.keys(mock?.transaction?.params).every((key) => {
          if (mock.transaction.params && mock.transaction.params[key]) {
            return (
              JSON.stringify(normalize(mock.transaction.params[key])) ==
                JSON.stringify(normalize(transactionArguments[key])) ||
              deepAnythingMatch({ transactionArguments, mockParams: mock.transaction.params })
            )
          } else {
            return true
          }
        })
      }
      if (!allArgumentsMatch) {
        return
      }
    }
    return mock
  })
}

let getRandomHash = function () {
  return ethers.BigNumber.from(
    '1' +
      Array(76)
        .fill()
        .map(() => Math.random().toString()[4])
        .join(''),
  )._hex
}

let findAnyMockForAddress = (address) => {
  return mocks.find((mock) => {
    if (normalize(mock?.transaction?.to) !== normalize(address)) {
      return
    }
    return mock
  })
}

let getTransactionToMock = ({ transactionArguments, params, contractFunction }) => {
  let transactionToMock = {
    to: params.to,
    method: contractFunction.name,
  }

  if (transactionArguments && transactionArguments.length) {
    let paramsToBeMocked = {}
    Object.keys(transactionArguments).forEach((key) => {
      if (key.match(/\D/)) {
        paramsToBeMocked[key] = normalize(transactionArguments[key])
      }
    })
    transactionToMock['params'] = paramsToBeMocked
  }

  return transactionToMock
}

let sendTransaction = function ({ params, provider }) {
  let mock = findMock({ params, provider })
  if (mock) {
    mock.transaction._id = getRandomHash()
    mock.calls.add(params)
    return Promise.resolve(mock.transaction._id)
  } else {
    mock = findAnyMockForAddress(params.to)
    if (mock?.transaction?.api) {
      let data = params.data
      let contract = getContract({ params: params, mock, provider })
      let contractFunction = getContractFunction({ data, params, mock, provider })
      let transactionArguments = decodeTransactionArguments({ params, mock, provider })
      throw (
        'Web3Mock: Please mock the following transaction: ' +
        JSON.stringify({
          blockchain: 'ethereum',
          transaction: getTransactionToMock({ transactionArguments, params, contractFunction }),
        })
      )
    } else {
      throw ['Web3Mock: Please mock the transaction to: ' + params.to].join('')
    }
  }
}

let findMockedTransaction = function (hash) {
  return mocks.find((mock) => {
    return mock?.transaction?._id == hash && mock?.transaction?._confirmed
  })
}

let getTransactionReceipt = function ({ hash }) {
  let mock = findMockedTransaction(hash)
  if (mock) {
    return Promise.resolve({
      transactionHash: hash,
      transactionIndex: '0x1',
      blockNumber: ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
        ._hex,
      blockHash: getRandomHash(),
      cumulativeGasUsed: '0x33bc',
      gasUsed: '0x4dc',
      logs: [],
      logsBloom: '0x0000000000000000000000000000000000000000',
      status: '0x1',
    })
  } else {
    return Promise.resolve(null)
  }
}

let getTransactionByHash = function ({ hash }) {
  let mock = findMockedTransaction(hash)

  let transaction = {
    from: '0xb7576e9d314df41ec5506494293afb1bd5d3f65d',
    gas: '0x29857',
    gasPrice: '0xba43b7400',
    hash: hash,
    input:
      '0x606060405261022e806100136000396000f300606060405260e060020a6000350463201745d5811461003c578063432ced04146100d257806379ce9fac14610141578063d5fa2b00146101a8575b005b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081206001810180548254600160a060020a0319908116909355919091169055600160a060020a038316906803bd913e6c1df40000606082818181858883f1505060405184935060008051602061020e833981519152929150a2505050565b61003a600435600081815260208190526040812060010154600160a060020a031614801561010957506803bd913e6c1df400003410155b1561013e57604060009081206001018054600160a060020a03191633179055819060008051602061020e833981519152906060a25b50565b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081206001018054600160a060020a03191684179055819060008051602061020e833981519152906060a2505050565b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081208054600160a060020a03191684179055819060008051602061020e833981519152906060a25b5050505600a6697e974e6a320f454390be03f74955e8978f1a6971ea6730542e37b66179bc',
    nonce: '0x0',
    r: '0xcfb56087c168a48bc69bd2634172fd9defd77bd172387e2137643906ff3606f6',
    s: '0x3474eb47999927f2bed4d4ec27d7e8bb4ad17c61d76761e40fdbd859d84c3bd5',
    to: null,
    transactionIndex: '0x1',
    type: '0x0',
    v: '0x1c',
    value: '0x0',
  }

  if (mock) {
    Object.assign(transaction, {
      blockHash: getRandomHash(),
      blockNumber: ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
        ._hex,
    })
  }
  return Promise.resolve(transaction)
}

let confirm = function (transaction) {
  transaction._confirmedAtBlock = getCurrentBlock()
  return transaction
}

export { sendTransaction, mockTransaction, getTransactionByHash, getTransactionReceipt, confirm }
