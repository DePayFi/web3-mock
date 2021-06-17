import { ethers } from 'ethers';

let normalize = function (input) {
  if (input instanceof Array) {
    return input.map((element) => normalize(element))
  } else {
    if (input.toString) {
      return input.toString().toLowerCase()
    } else if (typeof argument === 'string' && input.match('0x')) {
      return input.toLowerCase()
    } else {
      return argument
    }
  }
};

let mocks;

let mockCalls = function (configurations) {
  mocks = {};
  if (configurations === undefined) {
    return
  }
  let configurationWithLowerCaseAddress = {};
  for (const [address, configuration] of Object.entries(configurations)) {
    configurationWithLowerCaseAddress[normalize(address)] = configuration;
  }
  Object.assign(mocks, configurationWithLowerCaseAddress);
};

let call = function ({ params, window }) {
  let callParams = params[0];
  let address = normalize(callParams.to);
  if (mocks[address] === undefined) {
    throw 'Web3Mock Ethereum calls: Please mock the contract at: ' + address
  } else if (mocks[address].abi === undefined) {
    throw 'Web3Mock Ethereum calls: Please mock the abi of the contract at: ' + address
  } else {
    let data = callParams.data;
    let methodSelector = data.split('000000000000000000000000')[0];
    let contract = new ethers.Contract(
      address,
      mocks[address].abi,
      new ethers.providers.Web3Provider(window.ethereum),
    );

    let contractFunction = contract.interface.getFunction(methodSelector);
    if (mocks[address][contractFunction.name]) {
      let callMock = mocks[address][contractFunction.name];
      let callArguments = contract.interface.decodeFunctionData(contractFunction, data);

      if (callArguments !== undefined) {
        if (typeof callMock === 'object' && !Array.isArray(callMock)) {
          if (callArguments.length === 1) {
            callMock = callMock[callArguments[0]];
          } else {
            let mappedCallArguments = callArguments.map((argument) => normalize(argument));
            callMock = callMock[mappedCallArguments];
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

      callMock = [callMock];
      let encodedResult = contract.interface.encodeFunctionResult(contractFunction.name, callMock);
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
};

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let mocks$1;

let mockTransactions = function (configuration) {
  if (configuration === undefined) {
    mocks$1 = undefined;
  } else {
    mocks$1 = {};
  }
  if (configuration === undefined) {
    return
  }
  let configurationWithLowerCaseAddress = {};
  for (const [address, configuration] of Object.entries(configuration)) {
    configurationWithLowerCaseAddress[normalize(address)] = configuration;
  }
  Object.assign(mocks$1, configurationWithLowerCaseAddress);
};

let getContract = function ({ params, mock, window }) {
  return new ethers.Contract(
    params.to,
    mock.abi,
    new ethers.providers.Web3Provider(window.ethereum),
  )
};

let getContractFunction = function ({ data, params, mock, window }) {
  let contract = getContract({ params, mock, window });
  let methodSelector = data.split('000000000000000000000000')[0];
  return contract.interface.getFunction(methodSelector)
};

let decodeTransactionArguments = function ({ params, mock, window }) {
  let data = params.data;
  let contract = getContract({ params, mock, window });
  let contractFunction = getContractFunction({ data, params, mock, window });
  if (_optionalChain([mock, 'optionalAccess', _ => _.method]) && contractFunction.name != mock.method) {
    return undefined
  }
  return contract.interface.decodeFunctionData(contractFunction, data)
};

let findMock = function ({ params, mocks, window }) {
  params = params[0];
  let mock = mocks[params.to];
  if (_optionalChain([mock, 'optionalAccess', _2 => _2.value]) && ethers.BigNumber.from(params.value).toString() !== mock.value) {
    return undefined
  }
  if (_optionalChain([mock, 'optionalAccess', _3 => _3.from]) && normalize(params.from) !== normalize(mock.from)) {
    return undefined
  }
  if (params.data !== undefined) {
    if (mock.abi === undefined) {
      throw (
        'Web3Mock Ethereum transactions: Please mock the abi of the contract: { transactions: { "' +
        params.to +
        '": { abi: ABI } } }'
      )
    } else {
      let transactionArguments = decodeTransactionArguments({ params, mock, window });
      let allArgumentsMatch = Object.keys(_optionalChain([mock, 'optionalAccess', _4 => _4.params])).every((key) => {
        if (mock.params[key]) {
          return (
            JSON.stringify(normalize(mock.params[key])) ==
            JSON.stringify(normalize(transactionArguments[key]))
          )
        } else {
          return true
        }
      });
      if (!allArgumentsMatch) {
        return undefined
      }
    }
  }
  return mock
};

let transactionHash = function () {
  return '0xbb8d9e2262cd2d93d9bf7854d35f8e016dd985e7b3eb715d0d7faf7290a0ff4d'
};

let sendTransaction = function ({ params, window }) {
  if (mocks$1 === undefined) {
    return Promise.resolve(transactionHash())
  } else {
    let mock = findMock({ params, mocks: mocks$1, window });
    if (mock) {
      return Promise.resolve(transactionHash())
    } else if (params[0].data) {
      let mock = mocks$1[params[0].to];
      if (mock && mock.abi) {
        let transactionArguments = decodeTransactionArguments({ params: params[0], mock, window });
        let contractFunction = getContractFunction({
          data: params[0].data,
          params: params[0],
          mock,
          window,
        });
        let transactionArgumentsToParams = {};
        Object.keys(transactionArguments).forEach((key) => {
          if (key.match(/\D/)) {
            transactionArgumentsToParams[key] = normalize(transactionArguments[key]);
          }
        });
        throw (
          'Web3Mock Ethereum transactions: Please mock the contract call transaction: { transactions: { "' +
          params[0].to +
          '": { method: "' +
          contractFunction.name +
          '", params: ' +
          JSON.stringify(transactionArgumentsToParams) +
          ' } }'
        )
      } else {
        throw (
          'Web3Mock Ethereum transactions: Please mock the contract call transaction: { transactions: { "' +
          params[0].to +
          '": { } }'
        )
      }
    } else {
      throw (
        'Web3Mock Ethereum transactions: Please mock: { transactions: { "' +
        params[0].to +
        '": { "from": "' +
        params[0].from +
        '" , "value": "1000000000000000000"} }'
      )
    }
  }
};

let events;

let resetEvents = () => {
  events = {};
};

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

let request = ({ request, window }) => {
  switch (request.method) {
    case 'eth_chainId':
      return Promise.resolve('0x1')

    case 'eth_getBalance':
      return Promise.resolve(ethers.BigNumber.from('0'))

    case 'net_version':
      return Promise.resolve(1)

    case 'eth_requestAccounts':
    case 'eth_accounts':
      return Promise.resolve(['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'])

    case 'eth_estimateGas':
      return Promise.resolve('0x2c4a0')

    case 'eth_blockNumber':
      return Promise.resolve('0x5daf3b')

    case 'eth_call':
      return call({ params: request.params, window })

    case 'eth_sendTransaction':
      return sendTransaction({ params: request.params, window })

    case 'eth_getTransactionByHash':
      return Promise.resolve({
        blockHash: '0x50bc252c171eedfde3a2cb280616c5c42de3698eb5aa693002e46e5a812a4ff7',
        blockNumber: '0xc544',
        from: '0xb7576e9d314df41ec5506494293afb1bd5d3f65d',
        gas: '0x29857',
        gasPrice: '0xba43b7400',
        hash: '0xbb8d9e2262cd2d93d9bf7854d35f8e016dd985e7b3eb715d0d7faf7290a0ff4d',
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
      })

    case 'eth_getTransactionReceipt':
      return Promise.resolve({
        transactionHash: '0xbb8d9e2262cd2d93d9bf7854d35f8e016dd985e7b3eb715d0d7faf7290a0ff4d',
        transactionIndex: '0x1',
        blockNumber: '0xc544',
        blockHash: '0x50bc252c171eedfde3a2cb280616c5c42de3698eb5aa693002e46e5a812a4ff7',
        cumulativeGasUsed: '0x33bc',
        gasUsed: '0x4dc',
        logs: [],
        logsBloom: '0x0000000000000000000000000000000000000000',
        status: '0x1',
      })

    default:
      throw 'Web3Mock Ethereum request: Unknown request method ' + request.method + '!'
  }
};

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

let Ethereum = ({ configuration, window }) => {
  mockCalls(_optionalChain$1([configuration, 'optionalAccess', _ => _.calls]));
  mockTransactions(_optionalChain$1([configuration, 'optionalAccess', _2 => _2.transactions]));
  resetEvents();

  window.ethereum = {
    ...window.ethereum,
    on,
    request: (configuration) => request({ request: configuration, window }),
  };

  return Ethereum
};

Ethereum.trigger = triggerEvent;

let mocks$2 = [];

let mock = function ({ configuration, window }) {
  let blockchain;

  if (typeof configuration === 'string') {
    blockchain = configuration;
  } else if (typeof configuration === 'object') {
    blockchain = Object.keys(configuration)[0];
  } else {
    throw 'Web3Mock: Unknown mock configuration type!'
  }

  switch (blockchain) {
    case 'ethereum':
      mocks$2.push(Ethereum({ configuration: configuration['ethereum'], window }));
      break
    default:
      throw 'Web3Mock: Unknown blockchain!'
  }
};

let Web3Mock = ({ mocks, window = window }) => {
  if (mocks === undefined || mocks.length === 0) {
    throw 'Web3Mock: No mocks defined!'
  }

  if (mocks instanceof Array) {
    mocks.forEach((configuration) => {
      if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
        throw 'Web3Mock: Mock configurations are empty!'
      }
      mock({ configuration, window });
    });
  } else if (typeof mocks === 'string') {
    mock({ configuration: mocks, window });
  } else if (typeof mocks === 'object') {
    if (Object.keys(mocks).length === 0) {
      throw 'Web3Mock: Mock configurations are empty!'
    }
    for (const [blockchain, configuration] of Object.entries(mocks)) {
      mock({ configuration: { [blockchain]: configuration }, window });
    }
  } else {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
};

Web3Mock.trigger = (eventName, value) => {
  mocks$2.forEach((blockchainMock) => blockchainMock.trigger(eventName, value));
};

export { Web3Mock };
