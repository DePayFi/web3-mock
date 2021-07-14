import { ethers as ethers$1 } from 'ethers';

let currentBlock = 1;

let getCurrentBlock$1 = () => currentBlock;

let increaseBlock = (amount = 1) => {
  currentBlock += amount;
};

let confirm = (transaction) => {
  transaction._confirmedAtBlock = getCurrentBlock$1();
  return transaction
};

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var confirm$1 = (mock) => {
  if (_optionalChain([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2._id])) {
    mock.transaction._confirmed = true;
    switch (mock.blockchain) {
      case 'ethereum':
        confirm(mock.transaction);
        break
    }
  } else {
    throw 'Web3Mock: Given mock is not a mocked transaction: ' + mock
  }
};

let increaseBlock$1 = (amount) => {
  increaseBlock(amount);
};

let events = {};

let triggerEvent = (eventName, value) => {
  events[eventName].forEach(function (callback) {
    callback(value);
  });
};

let on = (eventName, callback) => {
  if (events[eventName] === undefined) {
    events[eventName] = [];
  }
  events[eventName].push(callback);
};

var getRandomTransactionHash = () => {
  return ethers$1.BigNumber.from(
    '1' +
      Array(76)
        .fill()
        .map(() => Math.random().toString()[4])
        .join(''),
  )._hex
};

var anything = '__ANYTHING__';

let normalize = function (input) {
  if (input instanceof Array) {
    return input.map((element) => normalize(element))
  } else if (typeof input === 'undefined') {
    return input
  } else if (typeof input === 'object' && input._isBigNumber) {
    return input.toString()
  } else {
    if (typeof input === 'object') {
      return JSON.stringify(input)
    } else if (input.toString) {
      return input.toString().toLowerCase()
    } else if (typeof input === 'string' && input.match('0x')) {
      return input.toLowerCase()
    } else {
      return input
    }
  }
};

let fillMockParamsWithAnything = ({ contractArguments, mockParams }) => {
  if (typeof mockParams === 'object' && !Array.isArray(mockParams) && !mockParams._isBigNumber) {
    let filledMockParams = {};
    Object.keys(mockParams).forEach((key) => {
      filledMockParams[key] = fillMockParamsWithAnything({
        contractArguments: contractArguments[key],
        mockParams: mockParams[key],
      });
    });
    return filledMockParams
  } else if (Array.isArray(mockParams)) {
    return mockParams.map((element, index) => {
      return fillMockParamsWithAnything({
        contractArguments: contractArguments[index],
        mockParams: element,
      })
    })
  } else {
    if (mockParams === anything) {
      return normalize(contractArguments)
    } else {
      return mockParams
    }
  }
};

let anythingDeepMatch = ({ contractArguments, mockParams }) => {
  let filledMockParams = fillMockParamsWithAnything({ contractArguments, mockParams });
  return Object.keys(filledMockParams).every((key) => {
    return (
      JSON.stringify(normalize(filledMockParams[key])) ==
      JSON.stringify(normalize(contractArguments[key]))
    )
  })
};

let anythingMatch = ({ contractArguments, mockParams }) => {
  if (
    mockParams === anything &&
    typeof contractArguments !== 'undefined' &&
    contractArguments.length > 0
  ) {
    return true
  } else if (!JSON.stringify(mockParams).match(anything)) {
    return false
  } else if (Array.isArray(mockParams) && anythingDeepMatch({ contractArguments, mockParams })) {
    return true
  }

  return false
};

let getContract = ({ address, api, provider }) => {
  return new ethers$1.Contract(address, api, provider)
};

let getContractFunction = ({ data, address, api, provider }) => {
  let contract = getContract({ address, api, provider });
  let methodSelector = data.split('000000000000000000000000')[0];
  try {
    return contract.interface.getFunction(methodSelector)
  } catch (error) {
    if (error.reason == 'no matching function') {
      throw 'Web3Mock: method not found in mocked api!'
    } else {
      throw error
    }
  }
};

let getContractArguments = ({ params, api, provider }) => {
  let data = params.data;
  let address = params.to;
  let contract = getContract({ address, api, provider });
  let contractFunction = getContractFunction({ data, address, api, provider });
  return contract.interface.decodeFunctionData(contractFunction, data)
};

let encode = ({ result, params, api, provider }) => {
  let address = params.to;
  let data = params.data;
  let contract = getContract({ address, api, provider });
  let contractFunction = getContractFunction({ data, address, api, provider });
  let callArguments = getContractArguments({ params, api, provider });
  return contract.interface.encodeFunctionResult(contractFunction.name, [result])
};

let required = [];

let requireMock = (type) => {
  required.push(type);
};

let resetRequire = () => {
  required = [];
};

let mocks = [];

let resetMocks = () => {
  let window = global ? global : window;
  if (window.ethereum) {
    window.ethereum.isMetaMask = undefined;
  }
  mocks = [];
  resetRequire();
};

resetMocks();

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let mockIsNotAnObject = (mock) => {
  return typeof mock !== 'object'
};

let mockHasWrongType = (mock, type) => {
  return mock[type] == undefined
};

let mockHasWrongTransactionData = (mock, type, params) => {
  return (
    (mock[type].to && normalize(params.to) !== normalize(mock[type].to)) ||
    (mock[type].from && normalize(params.from) !== normalize(mock[type].from)) ||
    (mock[type].value &&
      ethers$1.BigNumber.from(params.value).toString() !== normalize(mock[type].value))
  )
};

let mockHasWrongBalanceData = (mock, type, params) => {
  return mock[type].for && normalize(params) !== normalize(mock[type].for)
};

let mockHasWrongToAddress = (mock, type, params) => {
  return normalize(mock[type].to) !== normalize(params.to)
};

let mockDataDoesNotMatchSingleArgument = (mock, type, contractArguments) => {
  return (
    Array.isArray(mock[type].params) == false &&
    contractArguments.length == 1 &&
    normalize(mock[type].params) != normalize(contractArguments[0]) &&
    !anythingMatch({ contractArguments, mockParams: mock[type].params })
  )
};

let mockDataDoesNotMatchArrayArgument = (mock, type, contractArguments) => {
  return (
    Array.isArray(mock[type].params) &&
    JSON.stringify(contractArguments.map((argument) => normalize(argument))) !==
      JSON.stringify(mock[type].params.map((argument) => normalize(argument))) &&
    !anythingMatch({ contractArguments, mockParams: mock[type].params })
  )
};

let mockedArgumentsDoMatch = (mock, type, contractArguments) => {
  if (mock[type].params == undefined) {
    return true
  }
  if (mock[type].params == anything) {
    return true
  }

  let isDeepAnythingMatch = anythingDeepMatch({ contractArguments, mockParams: mock[type].params });

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
};

let mockDataDoesNotMatchObjectArugment = (mock, type, contractArguments) => {
  return (
    Array.isArray(mock[type].params) == false &&
    normalize(mock[type].params) != normalize(contractArguments[0]) &&
    !mockedArgumentsDoMatch(mock, type, contractArguments) &&
    !anythingMatch({ contractArguments, mockParams: mock[type].params })
  )
};

let mockHasWrongData = (mock, type, params, provider) => {
  if (_optionalChain$1([mock, 'access', _ => _[type], 'optionalAccess', _2 => _2.api]) == undefined) {
    return
  }

  let api = mock[type].api;
  let contractFunction = getContractFunction({
    data: params.data,
    address: params.to,
    api,
    provider,
  });
  if (mock[type].method !== contractFunction.name) {
    return true
  }

  let contractArguments = getContractArguments({ params, api, provider });
  if (mockDataDoesNotMatchSingleArgument(mock, type, contractArguments)) {
    return true
  }
  if (mockDataDoesNotMatchArrayArgument(mock, type, contractArguments)) {
    return true
  }
  if (mockDataDoesNotMatchObjectArugment(mock, type, contractArguments)) {
    return true
  }
};

let findMock = ({ type, params, provider }) => {
  return mocks.reverse().find((mock) => {
    if (mockIsNotAnObject(mock)) {
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

    return mock
  })
};

let findAnyMockForThisAddress = ({ type, params }) => {
  return mocks.find((mock) => {
    if (normalize(_optionalChain$1([mock, 'access', _3 => _3[type], 'optionalAccess', _4 => _4.to])) !== normalize(params.to)) {
      return
    }
    return mock
  })
};

let findMockByTransactionHash = (hash) => {
  return mocks.reverse().find((mock) => {
    return _optionalChain$1([mock, 'optionalAccess', _5 => _5.transaction, 'optionalAccess', _6 => _6._id]) == hash && _optionalChain$1([mock, 'optionalAccess', _7 => _7.transaction, 'optionalAccess', _8 => _8._confirmed])
  })
};

var getTransactionByHash = (hash) => {
  let mock = findMockByTransactionHash(hash);

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
  };

  if (mock) {
    Object.assign(transaction, {
      blockHash: getRandomTransactionHash(),
      blockNumber: ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
        ._hex,
    });
  }

  return Promise.resolve(transaction)
};

var getTransactionReceipt = (hash) => {
  let mock = findMockByTransactionHash(hash);

  if (mock) {
    return Promise.resolve({
      transactionHash: hash,
      transactionIndex: '0x1',
      blockNumber: ethers$1.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
        ._hex,
      blockHash: getRandomTransactionHash(),
      cumulativeGasUsed: '0x33bc',
      gasUsed: '0x4dc',
      logs: [],
      logsBloom: '0x0000000000000000000000000000000000000000',
      status: '0x1',
    })
  } else {
    return Promise.resolve(null)
  }
};

function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let balance = function ({ params, provider }) {
  let mock = findMock({ type: 'balance', params, provider });

  if (mock && _optionalChain$2([mock, 'access', _ => _.balance, 'optionalAccess', _2 => _2.return])) {
    mock.calls.add(params);
    return Promise.resolve(ethers$1.BigNumber.from(mock.balance.return))
  } else {
    throw (
      'Web3Mock: Please mock the balance request: ' +
      JSON.stringify({
        blockchain: 'ethereum',
        balance: {
          for: params,
          return: 'PUT BALANCE AMOUNT HERE',
        },
      })
    )
  }
};

function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let call = function ({ params, provider }) {
  let mock = findMock({ type: 'call', params, provider });

  if (mock) {
    mock.calls.add(params);
    return Promise.resolve(
      encode({ result: mock.call.return, api: mock.call.api, params, provider }),
    )
  } else {
    mock = findAnyMockForThisAddress({ type: 'call', params });
    if (mock && _optionalChain$3([mock, 'access', _ => _.call, 'optionalAccess', _2 => _2.api])) {
      throw (
        'Web3Mock: Please mock the contract call: ' +
        JSON.stringify({
          blockchain: 'ethereum',
          call: getCallToBeMock({ mock, params, provider }),
        })
      )
    } else {
      throw 'Web3Mock: Please mock the contract call to: ' + params.to
    }
  }
};

let getCallToBeMock = ({ mock, params, provider }) => {
  let address = params.to;
  let api = mock.call.api;
  let contractFunction = getContractFunction({ data: params.data, address, api, provider });
  let contractArguments = getContractArguments({ params, api, provider });

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    method: contractFunction.name,
    return: 'Your Value',
  };

  if (contractArguments && contractArguments.length) {
    if (Array.isArray(contractArguments) && contractArguments.length === 1) {
      toBeMocked['params'] = normalize(contractArguments[0]);
    } else {
      toBeMocked['params'] = contractArguments.map((argument) => normalize(argument));
    }
  }

  return toBeMocked
};

function _optionalChain$4(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let throwSuggestedMock = ({ mock, params, provider }) => {
  throw (
    'Web3Mock: Please mock the estimate: ' +
    JSON.stringify({
      blockchain: 'ethereum',
      estimate: getEstimateToBeMocked({ mock, params, provider }),
    })
  )
};

let estimate = ({ params, provider }) => {
  let defaultEstimate = Promise.resolve('0x2c4a0');

  if (params === undefined) {
    return defaultEstimate
  }

  let estimateMock = findMock({ type: 'estimate', params, provider });
  if (estimateMock) {
    estimateMock.calls.add(params);
    if (_optionalChain$4([estimateMock, 'access', _ => _.estimate, 'optionalAccess', _2 => _2.return])) {
      return Promise.resolve(ethers$1.BigNumber.from(estimateMock.estimate.return))
    } else {
      return defaultEstimate
    }
  } else if (required.includes('estimate')) {
    return throwSuggestedMock({ params, provider })
  }

  let transactionMock = findMock({ type: 'transaction', params, provider });
  if (transactionMock) {
    return defaultEstimate
  }

  let mock = findAnyMockForThisAddress({ type: 'estimate', params });
  if (mock) {
    return throwSuggestedMock({ mock, params, provider })
  } else {
    return defaultEstimate
  }
};

let getEstimateToBeMocked = ({ mock, params, provider }) => {
  let address = params.to;

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    return: 'ESTIMATED GAS',
  };

  if (mock === undefined) {
    return toBeMocked
  }

  let api = _optionalChain$4([mock, 'access', _3 => _3.estimate, 'optionalAccess', _4 => _4.api]);

  if (api) {
    let contractFunction = getContractFunction({ data: params.data, address, api, provider });
    let contractArguments = getContractArguments({ params, api, provider });

    toBeMocked['method'] = contractFunction.name;

    if (contractArguments && contractArguments.length) {
      let paramsToBeMocked = {};
      Object.keys(contractArguments).forEach((key) => {
        if (key.match(/\D/)) {
          paramsToBeMocked[key] = normalize(contractArguments[key]);
        }
      });
      toBeMocked['params'] = paramsToBeMocked;
    }
  }

  return toBeMocked
};

function _optionalChain$5(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let transaction = ({ params, provider }) => {
  let mock = findMock({ type: 'transaction', params, provider });
  if (mock) {
    mock.transaction._id = getRandomTransactionHash();
    mock.calls.add(params);
    return Promise.resolve(mock.transaction._id)
  } else {
    mock = findAnyMockForThisAddress({ type: 'transaction', params });
    if (mock && _optionalChain$5([mock, 'access', _ => _.transaction, 'optionalAccess', _2 => _2.api])) {
      throw (
        'Web3Mock: Please mock the transaction: ' +
        JSON.stringify({
          blockchain: 'ethereum',
          transaction: getTransactionToBeMocked({ mock, params, provider }),
        })
      )
    } else {
      throw 'Web3Mock: Please mock the transaction to: ' + params.to
    }
  }
};

let getTransactionToBeMocked = ({ mock, params, provider }) => {
  let address = params.to;
  let api = mock.transaction.api;
  let contractFunction = getContractFunction({ data: params.data, address, api, provider });
  let contractArguments = getContractArguments({ params, api, provider });

  let toBeMocked = {
    to: address,
    api: ['PLACE API HERE'],
    method: contractFunction.name,
  };

  if (contractArguments && contractArguments.length) {
    let paramsToBeMocked = {};
    Object.keys(contractArguments).forEach((key) => {
      if (key.match(/\D/)) {
        paramsToBeMocked[key] = normalize(contractArguments[key]);
      }
    });
    toBeMocked['params'] = paramsToBeMocked;
  }

  return toBeMocked
};

let request = ({ request, provider }) => {
  switch (request.method) {
    case 'eth_chainId':
      return Promise.resolve('0x1')

    case 'eth_getBalance':
      return balance({ params: request.params[0], provider })

    case 'net_version':
      return Promise.resolve(1)

    case 'eth_requestAccounts':
    case 'eth_accounts':
      return Promise.resolve(['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'])

    case 'eth_estimateGas':
      let params = request.params ? request.params[0] : undefined;
      return estimate({ params: params, provider })

    case 'eth_blockNumber':
      return Promise.resolve(ethers$1.BigNumber.from(getCurrentBlock$1())._hex)

    case 'eth_call':
      return call({ params: request.params[0], provider })

    case 'eth_sendTransaction':
      return transaction({ params: request.params[0], provider })

    case 'eth_getTransactionByHash':
      return getTransactionByHash(request.params[0])

    case 'eth_getTransactionReceipt':
      return getTransactionReceipt(request.params[0])

    default:
      throw 'Web3Mock Ethereum request: Unknown request method ' + request.method + '!'
  }
};

// https://docs.metamask.io/guide/ethereum-provider.html

let mock = ({ configuration, window, provider }) => {
  if (provider) {
    if (provider.send) {
      provider.send = (method, params) =>
        request({ provider, request: { method: method, params: params } });
    }
    if (provider.sendTransaction) {
      provider.sendTransaction = (method, params) =>
        request({ provider, request: { method: method, params: params } });
    }
  } else {
    window.ethereum = {
      ...window.ethereum,
      on,
      request: (configuration) => {
        return request({
          request: configuration,
          provider: new ethers$1.providers.Web3Provider(window.ethereum),
        })
      },
    };
  }

  return configuration
};

function _optionalChain$6(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let getWindow = (configuration) => {
  if (configuration.window) return configuration.window
  if (typeof global == 'object') return global
  if (typeof window == 'object') return window
};

let getBlockchain = (configuration) => {
  if (typeof configuration === 'string') {
    return configuration
  } else if (typeof configuration === 'object' && !Array.isArray(configuration)) {
    return configuration.blockchain
  } else {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
};

let apiIsMissing = (type, configuration) => {
  if (
    typeof configuration[type] == 'undefined' ||
    typeof configuration[type].method == 'undefined'
  ) {
    return false
  }
  return configuration[type] && _optionalChain$6([configuration, 'access', _ => _[type], 'optionalAccess', _2 => _2.api]) === undefined
};

let apiMissingErrorText = (type, configuration) => {
  return (
    'Web3Mock: Please provide the api for the ' +
    type +
    ': ' +
    JSON.stringify(
      Object.assign(configuration, {
        [type]: Object.assign(configuration[type], { api: ['PLACE API HERE'] }),
      }),
    )
  )
};

let preflight = (configuration) => {
  if (configuration === undefined || configuration.length === 0) {
    throw 'Web3Mock: No mock defined!'
  } else if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
    throw 'Web3Mock: Mock configuration is empty!'
  } else if (typeof configuration != 'string' && typeof configuration != 'object') {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
  if (apiIsMissing('call', configuration)) {
    throw apiMissingErrorText('call', configuration)
  } else if (apiIsMissing('transaction', configuration)) {
    throw apiMissingErrorText('transaction', configuration)
  } else if (apiIsMissing('estimate', configuration)) {
    throw apiMissingErrorText('estimate', configuration)
  }
};

let spy = (mock) => {
  if (typeof mock != 'object') {
    return mock
  }
  let all = [];
  mock.calls = {
    add: (call) => {
      all.push(call);
    },
    all: () => all,
    count: () => all.length,
  };
  return mock
};

let mockWallet = ({ configuration, window }) => {
  let wallet = configuration.wallet;
  switch (wallet) {
    case 'metamask':
      window.ethereum.isMetaMask = true;
      break
    default:
      throw 'Web3Mock: Unknown wallet!'
  }
};

let mock$1 = (configuration, call) => {
  preflight(configuration);

  let window = getWindow(configuration);
  let blockchain = getBlockchain(configuration);
  let provider = configuration.provider;
  let mock$1;

  switch (blockchain) {
    case 'ethereum':
      mock$1 = spy(mock({ configuration, window, provider }));
      if (configuration.wallet) mockWallet({ configuration, window });
      if (configuration.require) requireMock(configuration.require);
      mocks.push(mock$1);
      break
    default:
      throw 'Web3Mock: Unknown blockchain!'
  }

  return mock$1
};

var trigger = (eventName, value) => {
  triggerEvent(eventName, value);
};

export { anything, confirm$1 as confirm, increaseBlock$1 as increaseBlock, mock$1 as mock, normalize, resetMocks, trigger };
