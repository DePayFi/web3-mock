(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Mock = {}, global.ethers));
}(this, (function (exports, ethers) { 'use strict';

  let normalize = function (input) {
    if (input instanceof Array) {
      return input.map((element) => normalize(element))
    } else if (typeof input === 'undefined') {
      return input
    } else {
      if (input.toString) {
        return input.toString().toLowerCase()
      } else if (typeof input === 'string' && input.match('0x')) {
        return input.toLowerCase()
      } else {
        return input
      }
    }
  };

  let currentBlock = 1;

  let getCurrentBlock = () => currentBlock;

  let increaseBlock = (amount = 1) => {
    currentBlock += amount;
  };

  let mocks = [];

  let resetMocks = () => {
    mocks = [];
  };

  resetMocks();

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let mockTransaction = function (configuration) {
    if (_optionalChain([configuration, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2.method]) && _optionalChain([configuration, 'optionalAccess', _3 => _3.transaction, 'optionalAccess', _4 => _4.api]) === undefined) {
      throw 'Web3Mock: Please mock the api of the contract at: ' + _optionalChain([configuration, 'optionalAccess', _5 => _5.transaction, 'optionalAccess', _6 => _6.to])
    }
    return configuration
  };

  let getContract = function ({ params, mock, provider }) {
    return new ethers.ethers.Contract(params.to, _optionalChain([mock, 'optionalAccess', _7 => _7.transaction, 'optionalAccess', _8 => _8.api]), provider)
  };

  let getContractFunction = function ({ data, params, mock, provider }) {
    let contract = getContract({ params, mock, provider });
    let methodSelector = data.split('000000000000000000000000')[0];
    return contract.interface.getFunction(methodSelector)
  };

  let decodeTransactionArguments = function ({ params, mock, provider }) {
    let data = params.data;
    let contract = getContract({ params, mock, provider });
    let contractFunction = getContractFunction({ data, params, mock, provider });
    if (_optionalChain([mock, 'optionalAccess', _9 => _9.transaction, 'optionalAccess', _10 => _10.method]) && contractFunction.name != _optionalChain([mock, 'optionalAccess', _11 => _11.transaction, 'optionalAccess', _12 => _12.method])) {
      return
    }
    return contract.interface.decodeFunctionData(contractFunction, data)
  };

  let findMock = function ({ params, provider }) {
    return mocks.find((mock) => {
      let transaction = mock.transaction;
      if (typeof mock !== 'object') {
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
        normalize(transaction.value) !== ethers.ethers.BigNumber.from(params.value).toString()
      ) {
        return
      }
      if (params.data && mock.transaction.api) {
        let data = params.data;
        let methodSelector = data.split('000000000000000000000000')[0];
        let contract = new ethers.ethers.Contract(params.to, mock.transaction.api, provider);
        let contractFunction = contract.interface.getFunction(methodSelector);
        if (mock.transaction.method != contractFunction.name) {
          return
        }
        let transactionArguments = decodeTransactionArguments({ params, mock, provider });
        let allArgumentsMatch = Object.keys(_optionalChain([mock, 'optionalAccess', _13 => _13.transaction, 'optionalAccess', _14 => _14.params])).every((key) => {
          if (mock.transaction.params && mock.transaction.params[key]) {
            return (
              JSON.stringify(normalize(mock.transaction.params[key])) ==
              JSON.stringify(normalize(transactionArguments[key]))
            )
          } else {
            return true
          }
        });
        if (!allArgumentsMatch) {
          return
        }
      }
      return mock
    })
  };

  let getRandomHash = function () {
    return ethers.ethers.BigNumber.from(
      '1' +
        Array(76)
          .fill()
          .map(() => Math.random().toString()[4])
          .join(''),
    )._hex
  };

  let sendTransaction = function ({ params, provider }) {
    let mock = findMock({ params, provider });
    if (mock) {
      mock.transaction._id = getRandomHash();
      mock.calls.add(params);
      return Promise.resolve(mock.transaction._id)
    } else {
      throw ['Web3Mock: Please mock the transaction to: ' + params.to].join('')
    }
  };

  let findMockedTransaction = function (hash) {
    return mocks.find((mock) => {
      return _optionalChain([mock, 'optionalAccess', _15 => _15.transaction, 'optionalAccess', _16 => _16._id]) == hash && _optionalChain([mock, 'optionalAccess', _17 => _17.transaction, 'optionalAccess', _18 => _18._confirmed])
    })
  };

  let getTransactionReceipt = function ({ hash }) {
    let mock = findMockedTransaction(hash);
    if (mock) {
      return Promise.resolve({
        transactionHash: hash,
        transactionIndex: '0x1',
        blockNumber: ethers.ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
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
  };

  let getTransactionByHash = function ({ hash }) {
    let mock = findMockedTransaction(hash);

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
        blockHash: getRandomHash(),
        blockNumber: ethers.ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
          ._hex,
      });
    }
    return Promise.resolve(transaction)
  };

  let confirm = function (transaction) {
    transaction._confirmedAtBlock = getCurrentBlock();
    return transaction
  };

  function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  var confirm$1 = (mock) => {
    if (_optionalChain$1([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2._id])) {
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

  function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let mockCall = (configuration) => {
    if (_optionalChain$2([configuration, 'optionalAccess', _ => _.call, 'optionalAccess', _2 => _2.api]) === undefined) {
      throw 'Web3Mock: Please mock the api of the contract at: ' + _optionalChain$2([configuration, 'optionalAccess', _3 => _3.call, 'optionalAccess', _4 => _4.address])
    }
    return configuration
  };

  let findMockedCall = (address, params, provider) => {
    return mocks.find((mock) => {
      if (typeof mock !== 'object') {
        return
      }
      if (normalize(mock.call.address) !== normalize(address)) {
        return
      }
      let data = params.data;
      let methodSelector = data.split('000000000000000000000000')[0];
      let contract = new ethers.ethers.Contract(address, mock.call.api, provider);
      let contractFunction = contract.interface.getFunction(methodSelector);
      if (!Object.keys(mock.call).includes(contractFunction.name)) {
        return
      }
      return mock
    })
  };

  let getResult = (methodName, params, callArguments, address) => {
    if (callArguments === undefined || callArguments.length === 0) {
      return params
    }
    if (typeof params === 'object' && !Array.isArray(params)) {
      if (callArguments.length === 1) {
        return params[callArguments[0]]
      } else {
        let mappedCallArguments = callArguments.map((argument) => normalize(argument));
        params = params[mappedCallArguments];
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
  };

  let getContract$1 = ({ address, api, provider }) => {
    return new ethers.ethers.Contract(address, api, provider)
  };

  let getContractFunction$1 = ({ data, contract }) => {
    let methodSelector = data.split('000000000000000000000000')[0];
    return contract.interface.getFunction(methodSelector)
  };

  let getCallArguments = ({ contract, contractFunction, data }) => {
    return contract.interface.decodeFunctionData(contractFunction, data)
  };

  let findAnyMockForAddress = (address) => {
    return mocks.find((mock) => {
      if (normalize(_optionalChain$2([mock, 'optionalAccess', _5 => _5.call, 'optionalAccess', _6 => _6.address])) !== normalize(address)) {
        return
      }
      return mock
    })
  };

  let getCallToMock = ({ callArguments, params, contractFunction }) => {
    if (callArguments !== undefined && callArguments.length === 0) {
      callArguments = undefined;
    } else if (Array.isArray(params) && callArguments.length === 1) {
      callArguments = callArguments[0];
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
  };

  let call = function ({ params, provider }) {
    let address = normalize(params.to);
    let mock = findMockedCall(address, params, provider);
    let data = params.data;
    if (mock) {
      mock.calls.add(params);
      let contract = getContract$1({ address, api: mock.call.api, provider });
      let contractFunction = getContractFunction$1({ data, contract });
      let callArguments = getCallArguments({ contract, contractFunction, data });
      let result = getResult(
        contractFunction.name,
        mock.call[contractFunction.name],
        callArguments,
        address,
      );
      let encodedResult = contract.interface.encodeFunctionResult(contractFunction.name, [result]);
      return Promise.resolve(encodedResult)
    } else {
      mock = findAnyMockForAddress(address);
      if (_optionalChain$2([mock, 'optionalAccess', _7 => _7.call, 'optionalAccess', _8 => _8.api])) {
        let contract = getContract$1({ address, api: mock.call.api, provider });
        let contractFunction = getContractFunction$1({ data, contract });
        let callArguments = getCallArguments({ contract, contractFunction, data });
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
  };

  let request = ({ request, provider }) => {
    switch (request.method) {
      case 'eth_chainId':
        return Promise.resolve('0x1')

      case 'eth_getBalance':
        return Promise.resolve(ethers.ethers.BigNumber.from('0'))

      case 'net_version':
        return Promise.resolve(1)

      case 'eth_requestAccounts':
      case 'eth_accounts':
        return Promise.resolve(['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'])

      case 'eth_estimateGas':
        return Promise.resolve('0x2c4a0')

      case 'eth_blockNumber':
        return Promise.resolve(ethers.ethers.BigNumber.from(getCurrentBlock())._hex)

      case 'eth_call':
        return call({ params: request.params[0], provider })

      case 'eth_sendTransaction':
        return sendTransaction({ params: request.params[0], provider })

      case 'eth_getTransactionByHash':
        return getTransactionByHash({ hash: request.params[0], provider })

      case 'eth_getTransactionReceipt':
        return getTransactionReceipt({ hash: request.params[0], provider })

      default:
        throw 'Web3Mock Ethereum request: Unknown request method ' + request.method + '!'
    }
  };

  function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// https://docs.metamask.io/guide/ethereum-provider.html

  let mock = ({ configuration, window, provider }) => {
    if (_optionalChain$3([configuration, 'optionalAccess', _ => _.call])) mockCall(configuration);
    if (_optionalChain$3([configuration, 'optionalAccess', _2 => _2.transaction])) mockTransaction(configuration);

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
            provider: new ethers.ethers.providers.Web3Provider(window.ethereum),
          })
        },
      };
    }

    return configuration
  };

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

  let preflight = (configuration) => {
    if (configuration === undefined || configuration.length === 0) {
      throw 'Web3Mock: No mock defined!'
    } else if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
      throw 'Web3Mock: Mock configuration is empty!'
    } else if (typeof configuration != 'string' && typeof configuration != 'object') {
      throw 'Web3Mock: Unknown mock configuration type!'
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

  var mock$1 = (configuration, call) => {
    preflight(configuration);

    let window = getWindow(configuration);
    let blockchain = getBlockchain(configuration);
    let provider = configuration.provider;
    let mock$1;

    switch (blockchain) {
      case 'ethereum':
        mock$1 = spy(mock({ configuration: configuration, window, provider }));
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

  exports.confirm = confirm$1;
  exports.increaseBlock = increaseBlock$1;
  exports.mock = mock$1;
  exports.resetMocks = resetMocks;
  exports.trigger = trigger;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
