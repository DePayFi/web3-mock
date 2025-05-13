(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers'), require('@depay/web3-blockchains'), require('@depay/solana-web3.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ethers', '@depay/web3-blockchains', '@depay/solana-web3.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Mock = {}, global.ethers, global.Web3Blockchains, global.SolanaWeb3js));
}(this, (function (exports, ethers, Blockchains, solanaWeb3_js) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Blockchains__default = /*#__PURE__*/_interopDefaultLegacy(Blockchains);

  function _optionalChain$o(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }let normalize = function (input) {
    if (input instanceof Array) {
      return input.map((element) => normalize(element))
    } else if (typeof input === 'undefined') {
      return input
    } else if (typeof input === 'object' && input._isBigNumber) {
      return input.toString()
    } else {
      if (_optionalChain$o([input, 'optionalAccess', _ => _.toString])) {
        return input.toString().toLowerCase()
      } else if (typeof input === 'object') {
        return JSON.stringify(input)
      } else if (typeof input === 'string' && input.match('0x')) {
        return input.toLowerCase()
      } else {
        return input
      }
    }
  };

  let anything = '__ANYTHING__';

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

  var raise = (msg)=>{
    console.log(msg);
    throw(msg)
  };

  function _optionalChain$n(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let getContract = ({ address, api, provider }) => {
    return new ethers.ethers.Contract(address, api, provider)
  };

  let getContractFunction = ({ data, address, api, provider }) => {
    let contract = getContract({ address, api, provider });
    let methodSelector = data.substring(0, 10);
    try {
      return contract.interface.getFunction(methodSelector)
    } catch (error) {
      if (error.reason == 'no matching function') {
        raise('Web3Mock: method not found in mocked api!');
      } else {
        raise(error);
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
    let encodedResult;
    if(_optionalChain$n([contractFunction, 'optionalAccess', _ => _.outputs]) && contractFunction.outputs.length == 1) {
      encodedResult = [result];
    } else {
      encodedResult = result;
    }
    let method = contractFunction.name;
    if(contract[method] === undefined) {
      method = `${contractFunction.name}(${contractFunction.inputs.map((input)=>input.type).join(',')})`;
    }
    return contract.interface.encodeFunctionResult(method, encodedResult)
  };

  function _optionalChain$m(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }let getWindow = (configuration) => {
    if (_optionalChain$m([configuration, 'optionalAccess', _ => _.window])) return configuration.window
    if (typeof global == 'object') return global
    if (typeof cy == 'object') return cy.window().specWindow.window
    if (typeof window == 'object') return window
  };

  let currentBlock;

  let blockData = {};

  let getCurrentBlock = () => {
    return currentBlock
  };

  let resetCurrentBlock = ()=>{
    currentBlock = 1;
  };

  resetCurrentBlock();

  let increaseBlock = (amount = 1) => {
    currentBlock += amount;
  };

  let getBlockData = (number) => {
    return(blockData[number] || null)
  };

  let setBlockData = (number, data) => {
    blockData[number] = data;
  };

  let resetBlockData = ()=> {
    blockData = {};
  };

  let required = [];

  let requireMock = (type) => {
    required.push(type);
  };

  let resetRequire = () => {
    required = [];
  };

  let count = {};

  let increaseTransactionCount = (address) => {
    address = address.toLowerCase();
    if(count[address] == undefined) { count[address] = 0; }
    count[address] += 1;
  };

  let getTransactionCount = (address) => {
    address = address.toLowerCase();
    if(count[address] == undefined) { count[address] = 0; }
    return ethers.ethers.BigNumber.from(count[address].toString())._hex
  };

  let resetTransactionCount = ()=> {
    count = {};
  };

  let WalletConnectClass, WalletLinkClass;

  let mocks = [];

  const setWalletConnectClass = (givenWalletConnectClass)=> {
    WalletConnectClass = givenWalletConnectClass;
  };

  const setWalletLinkClass = (givenWalletLinkClass)=> {
    WalletLinkClass = givenWalletLinkClass;
  };

  const resetMocks = ()=> {
    let window = getWindow();
    if (window.ethereum) {
      window.ethereum = undefined;
    }
    mocks = [];
    resetRequire();
    resetCurrentBlock();
    resetBlockData();
    resetTransactionCount();
    if(WalletConnectClass) { WalletConnectClass.instance = undefined; }
    if(WalletLinkClass) { WalletLinkClass.instance = undefined; }
  };

  resetMocks();

  function _optionalChain$l(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let mockIsNotAnObject$1 = (mock) => {
    return typeof mock !== 'object'
  };

  let mockHasWrongType$1 = (mock, type) => {
    return mock[type] == undefined
  };

  let mockHasWrongBlockchain$1 = (mock, blockchain) => {
    if(blockchain == undefined) { return false }
    return mock.blockchain != blockchain
  };

  let mockHasWrongProvider$1 = (mock, provider) => {
    if(mock.provider == undefined) { return false }
    return mock.provider != provider
  };

  let mockHasWrongTransactionData$1 = (mock, type, params) => {
    return (
      (mock[type].to && normalize(params.to) !== normalize(mock[type].to)) ||
      (mock[type].from && normalize(params.from) !== normalize(mock[type].from)) ||
      (mock[type].value &&
        ethers.ethers.BigNumber.from(params.value).toString() !== normalize(mock[type].value))
    )
  };

  let mockHasWrongBalanceData$1 = (mock, type, params) => {
    return mock[type].for && normalize(params.address) !== normalize(mock[type].for)
  };

  let mockHasWrongToAddress$1 = (mock, type, params) => {
    return normalize(mock[type].to) !== normalize(_optionalChain$l([params, 'optionalAccess', _ => _.to]))
  };

  let mockHasWrongForAddress = (mock, type, params) =>{
    if(mock[type].for == null) { return false }
    return normalize(mock[type].for) !== normalize(_optionalChain$l([params, 'optionalAccess', _2 => _2.address]))
  };

  let mockDataDoesNotMatchSingleArgument = (mock, type, contractArguments) => {
    return (
      Array.isArray(mock[type].params) == false &&
      contractArguments.length == 1 &&
      _optionalChain$l([contractArguments, 'access', _3 => _3[0], 'optionalAccess', _4 => _4.length]) === undefined &&
      (
        normalize(mock[type].params) != normalize(contractArguments[0]) && 
        normalize(Object.values(mock[type].params)[0]) != normalize(contractArguments[0])
      ) &&
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

  let mockedArgumentsDoMatch = (mock, type, contractArguments, parentKey) => {
    if (mock[type].params == undefined) {
      return true
    }
    if (mock[type].params == anything) {
      return true
    }

    let isDeepAnythingMatch = anythingDeepMatch({ contractArguments, mockParams: parentKey ? mock[type].params[parentKey] : mock[type].params });

    return Object.keys(mock[type].params).every((key) => {
      if (mock[type].params && mock[type].params[key]) {
        let allParamsMatch;
        if(!parentKey && typeof mock[type].params[key] === 'object') {
          allParamsMatch = mockedArgumentsDoMatch(mock, type, contractArguments[key], key);
        }
        if(allParamsMatch){
          return true
        } else {
          return (
            JSON.stringify(normalize(mock[type].params[key])) ==
              JSON.stringify(normalize(contractArguments[key])) || isDeepAnythingMatch
          )
        }
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

  let mockHasWrongBlock$1 = (mock, block) => {
    if((typeof block == 'undefined' || block == 'latest') && typeof mock.block == 'undefined'){ return false }
    if(typeof mock.block == 'undefined') { return true }
    return ethers.ethers.utils.hexValue(mock.block) != block
  };

  let mockHasWrongData = (mock, type, params, provider) => {
    if (_optionalChain$l([mock, 'access', _5 => _5[type], 'optionalAccess', _6 => _6.api]) == undefined) {
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

  let mockHasWrongNetworkAction$1 = (mock, type, params) => {
    if(type != 'network') { return false }
    return Object.keys(mock.network)[0] != Object.keys(params)[0]
  };

  let findMock$1 = ({ type, blockchain, params, block, provider }) => {
    return mocks.find((mock) => {
      if (mockIsNotAnObject$1(mock)) {
        return
      }
      if (mockHasWrongBlockchain$1(mock, blockchain)) {
        return
      }
      if (mockHasWrongProvider$1(mock, provider)) {
        return
      }
      if (mockHasWrongType$1(mock, type)) {
        return
      }
      if (mockHasWrongTransactionData$1(mock, type, params)) {
        return
      }
      if (mockHasWrongBalanceData$1(mock, type, params)) {
        return
      }
      if (mockHasWrongToAddress$1(mock, type, params)) {
        return
      }
      if (mockHasWrongForAddress(mock, type, params)) {
        return
      }
      if (mockHasWrongData(mock, type, params, provider)) {
        return
      }
      if (mockHasWrongBlock$1(mock, block)) {
        return
      }
      if (mockHasWrongNetworkAction$1(mock, type, params)) {
        return
      }

      return mock
    })
  };

  let findAnyMockForThisAddress$1 = ({ type, params }) => {
    return mocks.find((mock) => {
      if (mock[type] === undefined) {
        return
      }
      if (normalize(_optionalChain$l([mock, 'access', _7 => _7[type], 'optionalAccess', _8 => _8.to])) !== normalize(params.to)) {
        return
      }
      return mock
    })
  };

  let findMockByTransactionHash$1 = (hash) => {
    return mocks.find((mock) => {
      return _optionalChain$l([mock, 'optionalAccess', _9 => _9.transaction, 'optionalAccess', _10 => _10._id]) == hash && (
        _optionalChain$l([mock, 'optionalAccess', _11 => _11.transaction, 'optionalAccess', _12 => _12._confirmed]) || _optionalChain$l([mock, 'optionalAccess', _13 => _13.transaction, 'optionalAccess', _14 => _14._failed])
      )
    })
  };

  let confirm$2 = (transaction) => {
    let mock = findMockByTransactionHash$1(transaction._id);
    transaction._confirmedAtBlock = getCurrentBlock();
    if(mock && mock._from) { increaseTransactionCount(mock._from); }
    return transaction
  };

  let confirm$1 = (transaction) => {
    transaction._confirmedAtBlock = getCurrentBlock();
    return transaction
  };

  let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base', 'worldchain'];
  supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base', 'worldchain'];
  supported.svm = ['solana'];

  function _optionalChain$k(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  var confirm = (mock) => {
    if (_optionalChain$k([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2._id])) {
      mock.transaction._confirmed = true;
      if(supported.evm.includes(mock.blockchain)) {

        
        confirm$2(mock.transaction);
        

      } else if(supported.svm.includes(mock.blockchain)) {

        
        confirm$1(mock.transaction);
        

      } else {
        raise('Web3Mock: Unknown blockchain!');
      }
      increaseBlock();
    } else {
      raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock));
    }
  };

  var to_b58 = function(
      B,            //Uint8Array raw byte input
      A             //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
  ) {
      var d = [],   //the array for storing the stream of base58 digits
          s = "",   //the result string variable that will be returned
          i,        //the iterator variable for the byte input
          j,        //the iterator variable for the base58 digit array (d)
          c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
          n;        //a temporary placeholder variable for the current base58 digit
      for(i in B) { //loop through each byte in the input stream
          j = 0,                           //reset the base58 digit iterator
          c = B[i];                        //set the initial carry amount equal to the current byte amount
          s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
          while(j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
              n = d[j];                    //set the placeholder for the current base58 digit
              n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
              c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
              d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
              j++;                          //iterate to the next base58 digit
          }
      }
      while(j--)        //since the base58 digits are backwards, loop through them in reverse order
          s += A[d[j]]; //lookup the character associated with each base58 digit
      return s          //return the final base58 string
  };

  const getRandomTransactionHash = (blockchain) => {
    if(supported.evm.includes(blockchain)) {
      return ethers.ethers.BigNumber.from(
        '1' +
          Array(76)
            .fill()
            .map(() => Math.random().toString()[4])
            .join(''),
      )._hex
    } else if (supported.svm.includes(blockchain)) {
      return to_b58(
        Array(32)
          .fill()
          .map(() => parseInt(Math.random().toString()[4]), 10),
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
      )
    }
  };

  var replace = (transactionMock, replacingTransactionMock, confirmed = true) => {
    if(transactionMock == undefined || replacingTransactionMock == undefined) { raise('replace requires (transactionMock, replacingTransactionMock)'); }
    if(transactionMock.transaction.from == undefined) { raise('transactionMock to be replaced requires at least a "from"'); }


    replacingTransactionMock.transaction._id = getRandomTransactionHash(replacingTransactionMock.blockchain);
    if(confirmed){
      replacingTransactionMock.transaction._confirmed = true;
    } else {
      replacingTransactionMock.transaction._failed = true;
    }
    setBlockData(getCurrentBlock(), {
      "number": "0xd6fa38",
      "baseFeePerGas": "0x2d79336308",
      "difficulty": "0x2ca5a8551de6c9",
      "extraData": "0x6575726f70652d63656e7472616c322d33",
      "gasLimit": "0x1ca35d2",
      "gasUsed": "0x4f1487",
      "hash": "0x8110e001148adad4d749559998e82061aa7d11bfdab65b840608327f98550fbc",
      "logsBloom": "0x04200102130400839382604c8300800e003008904824c0060100214904200e03012450500400101050704850004005208a028000092171092200140020202001c24221a08488114c08a4000c844008340024058014408121408021d1c04401011320800023240000031050205300088921155204008186203102141410180102d840890204a0d202001801070004003010060011030081090000044800100e0462580e48280221000a2020d0801186a80001800922060000506288a092c81814c1482202402041882514000204008800c00c3300044900102860814e088221219411248a86440000020017c104088b10404180012100004000011892002004b8",
      "miner": "0xea674fdde714fd979de3edf0f56aa9716b898ec8",
      "mixHash": "0x3c18abd91830b37cab8451afbbfb480de19bfc43e6cb9dea4b2eac1c41c81c2b",
      "nonce": "0x41fdf9e14a45d935",
      "parentHash": "0x885327d9913d7effef8532b5ee0815b1711a279b3414da90b93f175135701803",
      "receiptsRoot": "0x605fecc910c7e00a244da10635b170f7eabded9449321e79b73e42eb82619747",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": "0x6e63",
      "stateRoot": "0xc5549451a31830f2cbba18453066f9ef7539243f58ee1340341d1376a87ffd56",
      "timestamp": "0x61f2c7ec",
      "totalDifficulty": "0x87820e2f3a1f8913fee",
      "transactionsRoot": "0x5582fa18ef2f1eb6a4f3ca7d225b9fb1050074293cd30127ef3919a35fd50d2b",
      "uncles": [],
      transactions: [
        {
          "hash": replacingTransactionMock.transaction._id,
          "accessList": [],
          "blockHash": "0x8110e001148adad4d749559998e82061aa7d11bfdab65b840608327f98550fbc",
          "blockNumber": "0xd6fa38",
          "from": replacingTransactionMock.transaction.from,
          "gas": "0x55730",
          "gasPrice": "0x2d79336308",
          "input": "0x8803dbee0000000000000000000000000000000000000000001782b76fd64557b6b780000000000000000000000000000000000000000000000000032a27fd31187d551000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000008817d887960737a604cf712d3e5da8673dddb7f00000000000000000000000000000000000000000000000000000000061f2ca440000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000090185f2135308bad17527004364ebcc2d37e5f6",
          "maxFeePerGas": "0x2e87159fb3",
          "maxPriorityFeePerGas": "0x0",
          "nonce": getTransactionCount(replacingTransactionMock.transaction.from),
          "r": "0x81d4fe714af2e1725ad1746fc240a6ac3b0f795d207ac207f36abaf8db6c72b2",
          "s": "0x3c4f61eef2ecb98a50bf3940bc90e7dcacbc7f233a57d5eb44c0ae07fdec4ced",
          "to": replacingTransactionMock.transaction.to,
          "transactionIndex": "0x0",
          "type": "0x2",
          "v": "0x0",
          "value": "0x0"
        }
      ]
    });
    increaseBlock();
    increaseTransactionCount(transactionMock.transaction.from);
  };

  let fail$2 = (transaction, reason) => {
    let mock = findMockByTransactionHash$1(transaction._id);
    transaction._confirmedAtBlock = getCurrentBlock();
    transaction._failed = true;
    transaction._failedReason = reason;
    if(mock && mock._from) { increaseTransactionCount(mock._from); }
    return transaction
  };

  let fail$1 = (transaction, reason) => {
    transaction._confirmedAtBlock = getCurrentBlock();
    transaction._failed = true;
    transaction._failedReason = reason;
    return transaction
  };

  function _optionalChain$j(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  var fail = (mock, reason) => {
    if (_optionalChain$j([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2._id])) {
      mock.transaction._failed = true;
      mock.transaction._confirmed = false;
      if(supported.evm.includes(mock.blockchain)) {

        
        fail$2(mock.transaction, reason);
        

      } else if(supported.svm.includes(mock.blockchain)) {

        
        fail$1(mock.transaction, reason);
        

      } else {
        raise('Web3Mock: Unknown blockchain!');
      }
      increaseBlock();
    } else {
      raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock));
    }
  };

  let events$3 = {};

  let triggerEvent$3 = (eventName, value) => {
    if(events$3[eventName] == undefined) { return }
    events$3[eventName].forEach(function (callback) {
      callback(value);
    });
  };

  let on$3 = (eventName, callback) => {
    if (events$3[eventName] === undefined) {
      events$3[eventName] = [];
    }
    events$3[eventName].push(callback);
  };

  let removeListener$2 = (eventName, callback) => {
    if (events$3[eventName]) {
      let index = events$3[eventName].indexOf(callback);
      if (index >= 0) {
        events$3[eventName].splice(index, 1);
      }
    }
  };

  function _optionalChain$i(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  var getTransactionByHash = (hash) => {
    let mock = findMockByTransactionHash$1(hash);
    let lastTransactionMock = mocks.find((mock)=>mock.transaction);

    let from = (lastTransactionMock && lastTransactionMock.transaction.from) ? lastTransactionMock.transaction.from : '0xb7576e9d314df41ec5506494293afb1bd5d3f65d';
    let to = (lastTransactionMock && lastTransactionMock.transaction.to) ? lastTransactionMock.transaction.to : '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92';

    let transaction = {
      from,
      gas: '0x29857',
      gasPrice: '0xba43b7400',
      hash: hash,
      input:
        '0x606060405261022e806100136000396000f300606060405260e060020a6000350463201745d5811461003c578063432ced04146100d257806379ce9fac14610141578063d5fa2b00146101a8575b005b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081206001810180548254600160a060020a0319908116909355919091169055600160a060020a038316906803bd913e6c1df40000606082818181858883f1505060405184935060008051602061020e833981519152929150a2505050565b61003a600435600081815260208190526040812060010154600160a060020a031614801561010957506803bd913e6c1df400003410155b1561013e57604060009081206001018054600160a060020a03191633179055819060008051602061020e833981519152906060a25b50565b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081206001018054600160a060020a03191684179055819060008051602061020e833981519152906060a2505050565b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081208054600160a060020a03191684179055819060008051602061020e833981519152906060a25b5050505600a6697e974e6a320f454390be03f74955e8978f1a6971ea6730542e37b66179bc',
      nonce: ethers.ethers.utils.hexlify(getTransactionCount(from)),
      r: '0xcfb56087c168a48bc69bd2634172fd9defd77bd172387e2137643906ff3606f6',
      s: '0x3474eb47999927f2bed4d4ec27d7e8bb4ad17c61d76761e40fdbd859d84c3bd5',
      to,
      transactionIndex: '0x1',
      type: '0x0',
      v: '0x1c',
      value: ethers.ethers.BigNumber.from(_optionalChain$i([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2.value]) || 0)._hex,
    };

    if (mock) {
      Object.assign(transaction, {
        blockHash: getRandomTransactionHash(mock.blockchain),
        blockNumber: ethers.ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
          ._hex,
      });
    }

    return Promise.resolve(transaction)
  };

  function _optionalChain$h(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  var getTransactionReceipt = (hash) => {
    let mock = findMockByTransactionHash$1(hash);

    if (mock) {
      return Promise.resolve({
          from: _optionalChain$h([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2.from]),
          to: _optionalChain$h([mock, 'optionalAccess', _3 => _3.transaction, 'optionalAccess', _4 => _4.to]),
          transactionHash: hash,
          transactionIndex: '0x1',
          blockNumber: ethers.ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
            ._hex,
          blockHash: getRandomTransactionHash(mock.blockchain),
          cumulativeGasUsed: '0x33bc',
          gasUsed: '0x4dc',
          logs: _optionalChain$h([mock, 'optionalAccess', _5 => _5.transaction, 'optionalAccess', _6 => _6.logs]) || [],
          logsBloom: '0x0000000000000000000000000000000000000000',
          status: _optionalChain$h([mock, 'access', _7 => _7.transaction, 'optionalAccess', _8 => _8._failed]) ? '0x0' : '0x1',
        })
    } else {
      return Promise.resolve(null)
    }
  };

  function _optionalChain$g(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let balance$1 = function ({ blockchain, params, provider }) {
    params = (typeof params == 'object') ? params : { address: params };
    let mock = findMock$1({ blockchain, type: 'balance', params, provider });

    if (mock && _optionalChain$g([mock, 'access', _ => _.balance, 'optionalAccess', _2 => _2.return])) {
      mock.calls.add(params);
      if (_optionalChain$g([mock, 'optionalAccess', _3 => _3.balance, 'optionalAccess', _4 => _4.return]) instanceof Error) {
        return Promise.reject(mock.balance.return)
      } else {
        return Promise.resolve(ethers.ethers.BigNumber.from(mock.balance.return))
      }
    } else {
      raise(
        'Web3Mock: Please mock the balance request: ' +
        JSON.stringify({
          blockchain: blockchain,
          balance: {
            for: params.address,
            return: 'PUT BALANCE AMOUNT HERE',
          },
        })
      );
    }
  };

  function _optionalChain$f(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let callMock$2 = ({ mock, params, provider })=> {
    mock.calls.add(params);
    if (mock.request.return instanceof Error) {
      return Promise.reject({ 
        error: {
          message: mock.request.return.message
        }
      })
    } else {
      return Promise.resolve(
        encode({ result: mock.request.return, api: mock.request.api, params, provider })
      )
    }
  };

  let call = function ({ blockchain, params, block, provider }) {
    let mock = findMock$1({ type: 'request', params, block, provider });

    if (mock) {
      if(mock.request.delay) {
        return new Promise((resolve)=>{
          setTimeout(()=>resolve(callMock$2({ mock, params, provider })), mock.request.delay);
        })
      } else {
        return callMock$2({ mock, params, provider })
      }
    } else {
      mock = findAnyMockForThisAddress$1({ type: 'request', params });
      if (mock && _optionalChain$f([mock, 'access', _ => _.request, 'optionalAccess', _2 => _2.api])) {
        raise(
          'Web3Mock: Please mock the request: ' +
          JSON.stringify({
            blockchain,
            request: getCallToBeMock$1({ mock, params, provider, block }),
          })
        );
      } else {
        raise('Web3Mock: Please mock the request to: ' + params.to);
      }
    }
  };

  let getCallToBeMock$1 = ({ mock, params, provider, block }) => {
    let address = params.to;
    let api = mock.request.api;
    let contractFunction = getContractFunction({ data: params.data, address, api, provider });
    let contractArguments = getContractArguments({ params, api, provider });

    let toBeMocked = {
      to: address,
      api: ['PLACE API HERE'],
      method: contractFunction.name,
      return: 'Your Value',
    };

    if(block && block != 'latest') { toBeMocked['block'] = parseInt(block, 16); }

    if (contractArguments && contractArguments.length) {
      if (Array.isArray(contractArguments) && contractArguments.length === 1) {
        toBeMocked['params'] = normalize(contractArguments[0]);
      } else {
        toBeMocked['params'] = contractArguments.map((argument) => normalize(argument));
      }
    }

    return toBeMocked
  };

  let callMock$1 = ({ mock, params, provider })=> {
    mock.calls.add(params);
    if (mock.code.return instanceof Error) {
      return Promise.reject({ 
        error: {
          message: mock.code.return.message
        }
      })
    } else {
      return Promise.resolve(mock.code.return)
    }
  };

  let code = function ({ blockchain, params, provider }) {
    let mock = findMock$1({ type: 'code', params, provider });

    if (mock) {
      if(mock.code.delay) {
        return new Promise((resolve)=>{
          setTimeout(()=>resolve(callMock$1({ mock, params, provider })), mock.code.delay);
        })
      } else {
        return callMock$1({ mock, params, provider })
      }
    } else {
      raise(
        'Web3Mock: Please mock the request: ' +
        JSON.stringify({
          blockchain,
          code: getCallToBeMock({ mock, params, provider }),
        })
      );
    }
  };

  let getCallToBeMock = ({ mock, params, provider }) => {

    let toBeMocked = {
      for: params.address,
      return: 'Your Value',
    };

    return toBeMocked
  };

  function _optionalChain$e(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let throwSuggestedMock = ({ blockchain, mock, params, provider }) => {
    raise(
      'Web3Mock: Please mock the estimate: ' +
      JSON.stringify({
        blockchain,
        estimate: getEstimateToBeMocked({ mock, params, provider }),
      })
    );
  };

  let estimate = ({ blockchain, params, provider }) => {
    let defaultEstimate = Promise.resolve('0x2c4a0');
    let mock;

    if(_optionalChain$e([params, 'optionalAccess', _ => _.transaction])) { params = params.transaction; }

    mock = findMock$1({ type: 'estimate', params, provider });
    if (mock) {
      mock.calls.add(params);
      if (_optionalChain$e([mock, 'optionalAccess', _2 => _2.estimate, 'optionalAccess', _3 => _3.return]) instanceof Error) {
        return Promise.reject(mock.estimate.return)
      } else if (_optionalChain$e([mock, 'access', _4 => _4.estimate, 'optionalAccess', _5 => _5.return])) {
        return Promise.resolve(ethers.ethers.BigNumber.from(mock.estimate.return))
      } else {
        return defaultEstimate
      }
    } else if (required.includes('estimate')) {
      return throwSuggestedMock({ blockchain, params, provider })
    }

    mock = findMock$1({ type: 'transaction', params, provider });
    if (mock) {
      return defaultEstimate
    }

    mock = findAnyMockForThisAddress$1({ type: 'estimate', params });
    if (mock) {
      return throwSuggestedMock({ blockchain, mock, params, provider })
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

    let api = _optionalChain$e([mock, 'access', _6 => _6.estimate, 'optionalAccess', _7 => _7.api]);

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

  let requestAccounts$1 = ({ mock, params })=> {
    mock.calls.add(params || {});
    if (mock.accounts.return instanceof Error) {
      return Promise.reject(mock.accounts.return)
    } else {
      return Promise.resolve(
        mock.accounts.return
      )
    }
  };

  let getAccounts = function ({ blockchain, params, provider }) {

    let mock = findMock$1({ type: 'accounts', blockchain, params, provider });

    if (mock) {
      if(mock.accounts.delay) {
        return new Promise((resolve)=>{
          setTimeout(()=>resolve(requestAccounts$1({ mock, params })), mock.accounts.delay);
        })
      } else {
        return requestAccounts$1({ mock, params })
      }
    } else {
      raise(
        'Web3Mock: Please mock accounts: ' +
        JSON.stringify({
          blockchain,
          accounts: {
            return: ['YOUR ACCOUNT HERE']
          }
        })
      );
    }
  };

  let currentNetwork;

  let getCurrentNetwork = ()=>{
    return currentNetwork
  };

  let setCurrentNetwork = (network)=>{
    currentNetwork = network;
  };

  function _optionalChain$d(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  const getLogs = ({ blockchain, params, provider })=> {

    let mock = findMock$1({ type: 'logs', blockchain, params, provider });

    if(mock && _optionalChain$d([mock, 'optionalAccess', _ => _.logs, 'optionalAccess', _2 => _2.return])) {
      return Promise.resolve(mock.logs.return)
    } else {
      raise(
        'Web3Mock: Please mock the logs request: ' +
        JSON.stringify({
          blockchain,
          logs: getLogsToBeMocked({ params, provider }),
        })
      );
    }
  };

  const getLogsToBeMocked = ({ params, provider }) => {

    return {
      address: params.address,
      topics: params.topics,
      fromBlock: params.fromBlock,
      toBlock: params.toBlock,
      return: ['THE_RETURNED_LOGS']
    }
  };

  function _optionalChain$c(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let sign$1 = function ({ blockchain, params, provider }) {
    let mock = findMock$1({ blockchain, type: 'signature', params, provider });

    if (mock && _optionalChain$c([mock, 'access', _ => _.signature, 'optionalAccess', _2 => _2.return])) {
      mock.calls.add(params);

      if(mock.signature.delay) {
        return new Promise((resolve, reject)=>{
          setTimeout(()=>{
            if (mock.signature.return instanceof Error) {
              reject(mock.signature.return);
            } else {
              resolve(mock.signature.return);
            }
          }, mock.signature.delay);
        })
      } else {
        if (mock.signature.return instanceof Error) {
          return Promise.reject(mock.signature.return)
        } else {
          return Promise.resolve(mock.signature.return)
        }
      }
    } else {
      raise(
        'Web3Mock: Please mock the sign request: ' +
        JSON.stringify({
          blockchain: blockchain,
          signature: {
            params: params,
            return: 'PUT SIGNATURE HERE',
          },
        })
      );
    }
  };

  function _optionalChain$b(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let switchNetwork = function ({ blockchain, id, provider }) {
    let toBlockchain = Blockchains__default['default'].findById(id);
    if(toBlockchain == undefined) { throw `No blockchain found for id ${id}` }
    let params = { switchTo: toBlockchain.name };

    let mock = findMock$1({ type: 'network', params, provider });
    
    if (mock && _optionalChain$b([mock, 'access', _ => _.network, 'optionalAccess', _2 => _2.switchTo])) {
      mock.calls.add(params);
      if(mock.network.error) {
        if(typeof mock.network.error == 'function') {
          return Promise.reject(mock.network.error())
        } else {
          return Promise.reject(mock.network.error)
        }
      } else {
        setCurrentNetwork(toBlockchain.name);
        return Promise.resolve()
      }
    } else {
      raise(
        'Web3Mock: Please mock the network switch: ' +
        JSON.stringify({
          blockchain,
          network: {
            switchTo: toBlockchain.name
          },
        })
      );
    }
  };

  let addNetwork = function ({ blockchain, params, provider }) {
    let mock = findMock$1({ type: 'network', params: { add: params }, provider });
    
    if (mock && _optionalChain$b([mock, 'access', _3 => _3.network, 'optionalAccess', _4 => _4.add])) {
      mock.calls.add(params);
      return Promise.resolve()
    } else {
      raise(
        'Web3Mock: Please mock the network addition: ' +
        JSON.stringify({
          blockchain,
          network: {
            add: params
          },
        })
      );
    }
  };

  function _optionalChain$a(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  const traceTransaction = ({ blockchain, params, provider })=> {

    let mock = findMock$1({ type: 'trace', blockchain, params, provider });

    if(mock && _optionalChain$a([mock, 'optionalAccess', _ => _.trace, 'optionalAccess', _2 => _2.return])) {
      return Promise.resolve(mock.trace.return)
    } else {
      raise(
        'Web3Mock: Please mock the trace request: ' +
        JSON.stringify({
          blockchain,
          trace: getTraceToBeMocked({ params, provider }),
        })
      );
    }
  };

  const getTraceToBeMocked = ({ params, provider }) => {

    return {
      params: params,
      return: 'YOUR_TRACE_OBJECT'
    }
  };

  function _optionalChain$9(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let transaction = ({ blockchain, params, provider }) => {
    let mock = findMock$1({ type: 'transaction', params, provider });
    if (mock) {
      mock.calls.add(params);
      if(params && params.from) { mock._from = params.from; }

      if(mock.transaction.delay) {
        return new Promise((resolve, reject)=>{
          setTimeout(()=>{
            if (mock.transaction.return instanceof Error) {
              reject(mock.transaction.return);
            } else {
              resolve(mock.transaction._id);
            }
          }, mock.transaction.delay);
        })
      } else {
        if (mock.transaction.return instanceof Error) {
          return Promise.reject(mock.transaction.return)
        } else {
          return Promise.resolve(mock.transaction._id)
        }
      }

    } else {
      mock = findAnyMockForThisAddress$1({ type: 'transaction', params });
      if (mock && _optionalChain$9([mock, 'access', _ => _.transaction, 'optionalAccess', _2 => _2.api])) {
        raise(
          'Web3Mock: Please mock the transaction: ' +
          JSON.stringify({
            blockchain,
            transaction: getTransactionToBeMocked$1({ mock, params, provider }),
          })
        );
      } else {
        raise('Web3Mock: Please mock the transaction to: ' + params.to);
      }
    }
  };

  let getTransactionToBeMocked$1 = ({ mock, params, provider }) => {
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

  function _optionalChain$8(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let request$2 = ({ blockchain, request, provider }) => {
    let params;

    // Web3js request fix (nested request)
    if(Object.keys(request.method).includes('method')) {
      request = request.method;
    }

    if(blockchain == undefined && _optionalChain$8([provider, 'optionalAccess', _ => _._blockchain])) {
      blockchain = provider._blockchain;
    } else if(blockchain == undefined) {
      blockchain = getCurrentNetwork();
    }

    switch (request.method) {
      case 'eth_chainId':
        return Promise.resolve(Blockchains__default['default'].findByName(blockchain).id)

      case 'eth_getBalance':
        return balance$1({ blockchain, params: (request.params instanceof Array) ? request.params[0] : request.params, provider })

      case 'net_version':
        return Promise.resolve(Blockchains__default['default'].findByName(blockchain).networkId)

      case 'eth_requestAccounts':
      case 'eth_accounts':
        return getAccounts({ blockchain, provider })

      case 'eth_estimateGas':
        params = request.params ? ((request.params instanceof Array) ? request.params[0] : request.params) : undefined;
        return estimate({ blockchain, params, provider })

      case 'eth_blockNumber':
      case 'eth_getBlockNumber':
        return Promise.resolve(ethers.ethers.BigNumber.from(getCurrentBlock())._hex)

      case 'eth_getBlockByNumber':
        let blockNumber;
        if(request.params[0] == 'latest'){
          blockNumber = getCurrentBlock();
        } else {
          blockNumber = ethers.ethers.BigNumber.from(request.params[0].toString());
        }
        return Promise.resolve(getBlockData(parseInt(blockNumber.toString())))

      case 'eth_gasPrice':
        return Promise.resolve('0x12fee89674')

      case 'eth_call':
        if(request.params instanceof Array) {
          return call({ blockchain, params: request.params[0], block: request.params[1], provider })
        } else if(typeof request.params == 'object') {
          return call({ blockchain, params: request.params.transaction, block: request.params.blockTag, provider })
        }
        break

      case 'eth_sendTransaction':
        return transaction({ blockchain, params: request.params[0], provider })

      case 'eth_getTransactionByHash':
      case 'eth_getTransaction':
        return getTransactionByHash((request.params instanceof Array) ? request.params[0] : request.params.transactionHash)

      case 'eth_getTransactionReceipt':
        return getTransactionReceipt((request.params instanceof Array) ? request.params[0] : request.params.transactionHash)

      case 'eth_getTransactionCount':
        params = request.params ? ((request.params instanceof Array) ? request.params[0] : request.params.address) : undefined;
        return Promise.resolve(getTransactionCount(params))

      case 'eth_subscribe':
        return Promise.resolve()

      case 'wallet_switchEthereumChain':
        return switchNetwork({ blockchain, id: request.params[0].chainId, provider })

      case 'wallet_addEthereumChain':
        return addNetwork({ blockchain, params: request.params[0], provider })

      case 'eth_sign':
      case 'personal_sign':
      case 'eth_signTypedData':
      case 'eth_signTypedData_v1':
      case 'eth_signTypedData_v2':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
        return sign$1({ blockchain, params: request.params, provider })

      case 'eth_getCode':
        return code({ blockchain, params: request.params, provider })

      case 'eth_getGasPrice':
        return Promise.resolve(ethers.ethers.utils.hexlify(13370000000))

      case 'eth_getLogs':
        params = request.params ? ((request.params instanceof Array) ? request.params[0] : request.params) : undefined;
        return getLogs({ blockchain, params, provider })
      
      case 'debug_traceTransaction':
        return traceTransaction({ blockchain, params: request.params, provider })

      default:
        raise('Web3Mock request: Unknown request method ' + request.method + '!');
    }
  };

  let mock$4 = ({ blockchain, configuration, window, provider }) => {

    setCurrentNetwork(blockchain);

    if (provider) {
      if (provider.perform) {
        provider.perform = (method, params) =>{
          return request$2({ provider, request: { method: `eth_${method}`, params: params } })
        };
      }
      if (provider.send) {
        provider.send = (method, params) =>
          request$2({ provider, request: { method: method, params: params } });
      }
      if (provider.sendTransaction) {
        provider.sendTransaction = (method, params) =>
          request$2({ provider, request: { method: method, params: params } });
      }
    }

    window._ethereum = {
      ...window.ethereum,
      on: on$3,
      removeListener: removeListener$2,
      request: (payload) => {
        return request$2({
          request: payload,
          provider: new ethers.ethers.providers.Web3Provider(window._ethereum),
        })
      },
    };

    return configuration
  };

  function _optionalChain$7(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let mockIsNotAnObject = (mock) => {
    return typeof mock !== 'object'
  };

  let mockHasWrongType = (mock, type) => {
    return mock[type] == undefined
  };

  let mockHasWrongMethod = (mock, method) => {
    if(mock.request && mock.request.method) { return mock.request.method != method }
    return false
  };

  let mockHasWrongBlockchain = (mock, blockchain) => {
    if(blockchain == undefined) { return false }
    return mock.blockchain != blockchain
  };

  let mockHasWrongProvider = (mock, provider) => {
    if(mock.provider == undefined) { return false }
    return mock.provider != provider
  };

  let mockHasWrongTransactionData = (mock, type, transaction) => {
    let requiredFrom = _optionalChain$7([transaction, 'optionalAccess', _ => _.message, 'optionalAccess', _2 => _2.staticAccountKeys, 'optionalAccess', _3 => _3.length]) ? transaction.message.staticAccountKeys[0].toString() : undefined;

    return (
      (mock[type].from && normalize(requiredFrom) !== normalize(mock[type].from))
    )
  };

  let mockInstructionsMatch = (mockedInstruction, instruction)=>{
    if(_optionalChain$7([mockedInstruction, 'optionalAccess', _4 => _4.params]) == anything) { return true }
    if(!mockedInstruction.params) { return true }
    let decodedInstructionData;
    try { decodedInstructionData = mockedInstruction.api.decode(instruction.data); } catch (e) {}
    if(!decodedInstructionData) { return false }
    
    return Object.keys(mockedInstruction.params).every((key)=>{
      if(mockedInstruction.params[key] == anything) { return true }
      return normalize(mockedInstruction.params[key]) == normalize(decodedInstructionData[key])
    })
  };

  let mockKeysMatch = (mockedInstruction, instruction, transaction)=>{
    if(_optionalChain$7([mockedInstruction, 'optionalAccess', _5 => _5.keys]) == anything) { return true }
    if(!mockedInstruction.keys || mockedInstruction.keys.length === 0) { return true }
    return mockedInstruction.keys.every((mockedKey, index)=>{
      if(mockedKey === anything) { return true }
      return(
        mockedKey.pubkey.toString() === transaction.message.staticAccountKeys[instruction.accountKeyIndexes[index]].toString()
      )
    }) 
  };

  let mockHasWrongTransactionInstructions = (mock, type, transaction) => {
    return (
      (_optionalChain$7([mock, 'access', _6 => _6[type], 'optionalAccess', _7 => _7.instructions]) && mock[type].instructions.some((mockedInstruction)=>{
        return !(_optionalChain$7([transaction, 'optionalAccess', _8 => _8.message, 'optionalAccess', _9 => _9.compiledInstructions])).some((instruction)=>{
          let instructionProgramId = transaction.message.staticAccountKeys[instruction.programIdIndex].toString();
          if(normalize(instructionProgramId) != normalize(mockedInstruction.to)) { return false }
          if(!mockedInstruction.params && !mockedInstruction.keys) { return true }
          return mockInstructionsMatch(mockedInstruction, instruction) && mockKeysMatch(mockedInstruction, instruction, transaction)
        })
      }))
    )
  };

  let mockHasWrongBalanceData = (mock, type, params) => {
    return mock[type].for && normalize(params) !== normalize(mock[type].for)
  };

  let mockHasWrongToAddress = (mock, type, params) => {
    if(mock[type].to == undefined) { return false }
    return normalize(mock[type].to) !== normalize(params[0])
  };

  let mockHasWrongBlock = (mock, block) => {
    if((typeof block == 'undefined' || block == 'latest') && typeof mock.block == 'undefined'){ return false }
    if(typeof mock.block == 'undefined') { return true }
    return ethers.ethers.utils.hexValue(mock.block) != block
  };

  let mockHasWrongParams = (mock, type, params, provider) => {
    if(mock.request == undefined) { return false }
    if(mock.request.params == undefined) { return false }

    if(params == undefined) { return true }

    let requestParams;
    if(params && params[1]) {
      requestParams = JSON.parse(JSON.stringify(params[1]));
      delete requestParams.encoding;  
    } else {
      requestParams = params;
    }

    if(JSON.stringify(requestParams) != JSON.stringify(mock.request.params)) {
      return true
    }
  };

  let mockHasWrongNetworkAction = (mock, type, params) => {
    if(type != 'network') { return false }
    return Object.keys(mock.network)[0] != Object.keys(params)[0]
  };

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
      if (mockHasWrongParams(mock, type, params)) {
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
  };

  let findAnyMockForThisAddress = ({ type, params }) => {
    return mocks.find((mock) => {
      if (normalize(_optionalChain$7([mock, 'access', _10 => _10[type], 'optionalAccess', _11 => _11.to])) !== normalize(params[0])) {
        return
      }
      return mock
    })
  };

  let findMockByTransactionHash = (hash) => {
    return mocks.find((mock) => {
      return _optionalChain$7([mock, 'optionalAccess', _12 => _12.transaction, 'optionalAccess', _13 => _13._id]) == hash && (
        _optionalChain$7([mock, 'optionalAccess', _14 => _14.transaction, 'optionalAccess', _15 => _15._confirmed]) || _optionalChain$7([mock, 'optionalAccess', _16 => _16.transaction, 'optionalAccess', _17 => _17._failed])
      )
    })
  };

  let requestAccounts = ({ mock })=> {
    mock.calls.add({});
    if (mock.accounts.return instanceof Error) {
      return Promise.reject(mock.accounts.return)
    } else {
      return Promise.resolve(
        mock.accounts.return
      )
    }
  };

  let connect = function ({ blockchain, provider }) {

    let mock = findMock({ type: 'accounts', blockchain, provider });

    if (mock) {
      if(mock.accounts.delay) {
        return new Promise((resolve)=>{
          setTimeout(()=>{
            requestAccounts({ mock }).then((accounts)=>{ resolve({ publicKey: new solanaWeb3_js.PublicKey(accounts[0]) }); }); 
          }, mock.accounts.delay);
        })
      } else {
        return requestAccounts({ mock }).then((accounts)=>{ return { publicKey: new solanaWeb3_js.PublicKey(accounts[0]) } })
      }
    } else {
      raise(
        'Web3Mock: Please mock accounts: ' +
        JSON.stringify({
          blockchain,
          accounts: {
            return: ['YOUR ACCOUNT HERE']
          }
        })
      );
    }
  };

  const getLatestBlockhash = ({ blockchain })=>{
    return({
      blockhash: getRandomTransactionHash(blockchain),
      lastValidBlockHeight: getCurrentBlock()
    })
  };

  let events$2 = {};

  let triggerEvent$2 = (eventName, value) => {
    if(events$2[eventName] == undefined) { return }
    events$2[eventName].forEach(function (callback) {
      callback(value);
    });
  };

  let on$2 = (eventName, callback) => {
    if (events$2[eventName] === undefined) {
      events$2[eventName] = [];
    }
    events$2[eventName].push(callback);
  };

  let removeListener$1 = (eventName, callback) => {
    if (events$2[eventName]) {
      let index = events$2[eventName].indexOf(callback);
      if (index >= 0) {
        events$2[eventName].splice(index, 1);
      }
    }
  };

  function _optionalChain$6(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let balance = function ({ blockchain, params, provider }) {
    let mock = findMock({ blockchain, type: 'balance', params, provider });

    if (mock && _optionalChain$6([mock, 'access', _ => _.balance, 'optionalAccess', _2 => _2.return]) != undefined) {
      mock.calls.add(params);
      if (_optionalChain$6([mock, 'optionalAccess', _3 => _3.balance, 'optionalAccess', _4 => _4.return]) instanceof Error) {
        return Promise.reject(mock.balance.return)
      } else {
        return Promise.resolve(mock.balance.return)
      }
    } else {
      raise(
        'Web3Mock: Please mock the balance request: ' +
        JSON.stringify({
          blockchain: blockchain,
          balance: {
            for: params,
            return: 'PUT BALANCE AMOUNT HERE',
          },
        })
      );
    }
  };

  const NATIVE = Blockchains__default['default'].findByName('solana').currency.address;

  let marshalValue = (value, blockchain)=>{
    if(typeof value == 'number') {
      return value
    } else if (typeof value == 'string' && value == NATIVE) {
      return new solanaWeb3_js.PublicKey(value)
    } else if (typeof value == 'string' && value.match(/[^0-9-]/)) {
      try {
        return new solanaWeb3_js.PublicKey(value)
      } catch(e) { // normal string
        return solanaWeb3_js.Buffer.from(value, 'utf-8')
      }
    } else if (typeof value == 'string' && !value.match(/[^0-9-]/)) {
      return new solanaWeb3_js.BN(value, 10)
    } else if (typeof value == 'boolean') {
      return value
    } else if (value instanceof solanaWeb3_js.Buffer) {
      return value
    } else if (value instanceof Array) {
      return value.map((value)=>marshalValue(value))
    } else if (value instanceof Object) {
      let valueObject = {};
      Object.keys(value).forEach((key)=>{
        let singleValue = value[key];
        valueObject[key] = marshalValue(singleValue);
      });
      return valueObject
    } else if (value === null) {
      return null
    } else {
      raise(`Web3Mock: Unknown value type ${value}`);
    }
  };

  let callMock = ({ blockchain, mock, params, provider, raw })=> {
    mock.calls.add(params);

    if (mock.request.return instanceof Error) {
      return Promise.reject(mock.request.return.message)
    } else if(raw) {
      return Promise.resolve(mock.request.return)
    } else if(!mock.request.return) {
      return Promise.resolve(mock.request.return)
    } else if(mock.request.return && mock.request.return.raw ) {

      return Promise.resolve(mock.request.return.raw)

    } else {
      let response = marshalValue(mock.request.return);

      if(mock.request.api) {
        let size;
        if(mock.request.responseSize) {
          size = mock.request.responseSize;
        } else if(mock.request.api.span > 0) {
          size = mock.request.api.span;
        } else {
          size = 1000;
        }
        let buffer = solanaWeb3_js.Buffer.alloc(size);
        mock.request.api.encode(response, buffer);

        return Promise.resolve(
          [buffer.toString('base64'), 'base64']
        )
      } else {
        return Promise.resolve(response)
      }
    }
  };

  let responseData = function ({ blockchain, provider, method, params, raw }) {
    let mock = findMock({ blockchain, type: 'request', params, method, provider });

    if(mock) {
      if(mock.request.delay) {
        return new Promise((resolve)=>{
          setTimeout(()=>resolve(callMock({ blockchain, mock, params, provider, raw })), mock.request.delay);
        })
      } else {
        return callMock({ blockchain, mock, params, provider, raw })
      }

    } else {
      
      mock = findAnyMockForThisAddress({ type: 'request', params });
      if (mock) {
        raise(
          'Web3Mock: Please mock the request: ' +
          JSON.stringify({
            blockchain,
            request: getRequestToBeMocked({ mock, method, params, provider }),
          })
        );
      } else {
        raise('Web3Mock: Please mock the request to: ' + params[0]);
      }
    }
  };

  let getRequestToBeMocked = ({ mock, params, method, provider }) => {
    let address = params[0];
    mock.request.api;

    let toBeMocked = {
      to: address,
      method: method,
      return: 'Your Value',
    };

    if(mock.api){
      toBeMocked.api = ['PLACE API HERE'];
    }

    if(params[1]) {
      let requestParams = JSON.parse(JSON.stringify(params[1]));
      delete requestParams.encoding;
      toBeMocked.params = requestParams;
    }

    return toBeMocked
  };

  let request$1 = ({ blockchain, provider, method, params }) => {

    switch (method) {

      case 'getBalance':
        return balance({ blockchain, params: params[0], provider }).then((value)=>{ 
          return {
            jsonrpc: '2.0',
            id: '1', 
            result: { 
              context:{ apiVersion: '1.10.26', slot: 140152926 }, 
              value 
            } 
          }
        })

      case 'getBlockHeight':
        return {
          jsonrpc: '2.0',
          id: '1',
          result: getCurrentBlock()
        }

      case 'getSlot':
        return {
          jsonrpc: '2.0',
          id: '1',
          result: getCurrentBlock()
        }

      case 'getMinimumBalanceForRentExemption':
        return responseData({ blockchain, provider, method, params })
          .then((data)=>{
            return({
              jsonrpc: '2.0',
              id: '1', 
              result: data
            })
          })

      case 'getAccountInfo':
        return responseData({ blockchain, provider, method, params })
          .then((data)=>{
            let value;
            
            if(data) {
              value = {
                data,
                executable: false,
                owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                lamports: 3361680,
                rentEpoch: 326
              };
            } else {
              value = data;
            }

            return({
              jsonrpc: '2.0',
              id: '1', 
              result: {
                context:{ apiVersion: '1.10.26', slot: 140152926 }, 
                value
              } 
            })
          })

      case 'getProgramAccounts':
        return responseData({ blockchain, provider, method, params })
          .then((data)=>{
            return({
              jsonrpc: '2.0',
              id: '1', 
              result: data
            })
          })

      case 'getTokenAccountBalance':
        return responseData({ blockchain, provider, method, params, raw: true })
          .then((value)=>{
            return({
              jsonrpc: '2.0',
              id: '1', 
              result: {
                context:{ apiVersion: '1.10.26', slot: 140152926 }, 
                value
              }
            })
          })

      case 'getSignaturesForAddress':
        return responseData({ blockchain, provider, method, params, raw: true })
          .then((value)=>{
            return({
              jsonrpc: '2.0',
              id: '1', 
              result: value
            })
          })

      default:
        raise('Web3Mock request: Unknown request method ' + method + '!');
    }
  };

  let request = ({ blockchain, request, provider }) => {

    switch (request.method) {

      default:
        raise('Web3Mock request: Unknown request method ' + request.method + '!');
    }
  };

  function _optionalChain$5(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let sign = function ({ blockchain, params, provider }) {
    let mock = findMock({ blockchain, type: 'signature', params, provider });

    if (mock && _optionalChain$5([mock, 'access', _ => _.signature, 'optionalAccess', _2 => _2.return])) {
      mock.calls.add(params);

      if(mock.signature.delay) {
        return new Promise((resolve, reject)=>{
          setTimeout(()=>{
            if (mock.signature.return instanceof Error) {
              reject(mock.signature.return);
            } else {
              resolve(mock.signature.return);
            }
          }, mock.signature.delay);
        })
      } else {
        if (mock.signature.return instanceof Error) {
          return Promise.reject(mock.signature.return)
        } else {
          return Promise.resolve(mock.signature.return)
        }
      }
    } else {
      raise(
        'Web3Mock: Please mock the sign request: ' +
        JSON.stringify({
          blockchain: blockchain,
          signature: {
            params: params,
            return: 'PUT SIGNATURE HERE',
          },
        })
      );
    }
  };

  function _optionalChain$4(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let signAndSendTransaction = ({ blockchain, params, provider }) => {
    let mock = findMock({ type: 'transaction', params, provider });

    if(mock) {
      mock.calls.add(params);

      const publicKey = params.message.staticAccountKeys[0].toString();

      if(mock.transaction.delay) {
        return new Promise((resolve, reject)=>{
          setTimeout(()=>{
            if (mock.transaction.return instanceof Error) {
              reject(mock.transaction.return);
            } else {
              resolve({
                publicKey,
                signature: mock.transaction._id
              });
            }
          }, mock.transaction.delay);
        })
      } else {
        if (mock.transaction.return instanceof Error) {
          return Promise.reject(mock.transaction.return)
        } else {
          return Promise.resolve({
            publicKey,
            signature: mock.transaction._id
          })
        }
      }
    } else {
      raise(
        'Web3Mock: Please mock the following transaction: ' +
        JSON.stringify({
          blockchain,
          transaction: getTransactionToBeMocked(params),
        })
      );
    }
  };

  let getTransactionToBeMocked = (transaction) =>{

    let from = _optionalChain$4([transaction, 'optionalAccess', _ => _.message, 'optionalAccess', _2 => _2.staticAccountKeys, 'optionalAccess', _3 => _3.length]) ? transaction.message.staticAccountKeys[0].toString() : 'FROM';

    return {
      from,
      instructions: (_optionalChain$4([transaction, 'optionalAccess', _4 => _4.message, 'optionalAccess', _5 => _5.compiledInstructions]) || []).map((instruction)=>{

        let to = _optionalChain$4([transaction, 'optionalAccess', _6 => _6.message, 'optionalAccess', _7 => _7.staticAccountKeys, 'optionalAccess', _8 => _8.length]) ? transaction.message.staticAccountKeys[instruction.programIdIndex].toString() : 'TO';

        return {
          to,
          api: ["API HERE"],
          params: { value: "HERE" }
        }
      })
    }
  };

  let getSignatureStatus = ({ signature }) => {
    let mock = findMockByTransactionHash(signature);

    if(mock && mock.transaction._confirmedAtBlock) {
      const confirmations = getCurrentBlock()-mock.transaction._confirmedAtBlock-1;
      return({
        context: {apiVersion: '1.10.31', slot: 143064206},
        value: {
          confirmationStatus: confirmations == 0 ? "confirmed" : "finalized",
          confirmations,
          err: mock.transaction._failed ? { InstructionError: [0, 'Error'] } : null,
          slot: 143062809,
          status: mock.transaction._failed ? { Err: { InstructionError: [0, 'Error'] } } : { Ok: null }
        }
      })
    } else {
      return({
        context: {apiVersion: '1.10.31', slot: 143064206},
        value: null
      })
    }
  };

  let getConfirmedTransaction = ({ signature }) => {
    let mock = findMockByTransactionHash(signature);

    if(mock && mock.transaction._confirmedAtBlock) {
      getCurrentBlock()-mock.transaction._confirmedAtBlock-1;
      return({
        blockTime: 1658913018,
        slot: 143351809,
        transaction: {
          signatures: [mock.transaction._id],
          message: {
            compiledInstructions: mock.transaction.compiledInstructions ? mock.transaction.compiledInstructions : []
          }
        },
        meta: {
          err: mock.transaction._failed ? { InstructionError: [0, 'Error'] } : null,
          logMessages: mock.transaction._failedReason ? [mock.transaction._failedReason] : (mock.transaction.logMessages || [])
        }
      })
    } else {
      return(null)
    }
  };

  function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let simulateTransaction = ({ blockchain, params, provider }) => {
    let mock = findMock({ type: 'simulate', params, provider });

    if(!mock) {

      let from = _optionalChain$3([params, 'optionalAccess', _ => _.message, 'optionalAccess', _2 => _2.staticAccountKeys, 'optionalAccess', _3 => _3.length]) ? params.message.staticAccountKeys[0].toString() : 'FROM';

      raise(
        'Web3Mock: Please mock the simulation: ' +
        JSON.stringify({
          blockchain,
          simulate: {
            from,
            instructions: (_optionalChain$3([params, 'optionalAccess', _4 => _4.message, 'optionalAccess', _5 => _5.compiledInstructions]) || []).map((instruction)=>{
              
              let to = _optionalChain$3([params, 'optionalAccess', _6 => _6.message, 'optionalAccess', _7 => _7.staticAccountKeys, 'optionalAccess', _8 => _8.length]) ? params.message.staticAccountKeys[instruction.programIdIndex].toString() : 'TO';
              
              return {
                to,
                api: 'API HERE'
              }
            }),
            return: "YOUR RETURN HERE"
          }
        })
      );
    } else {
      return({ value: mock.simulate.return })
    }
  };

  let mock$3 = ({ blockchain, configuration, window, provider }) => {

    setCurrentNetwork(blockchain);

    if(provider) {
      provider.on = on$2;
      provider.removeListener = removeListener$1;
      provider._rpcRequest = (method, params)=>{
        return request$1({ blockchain, provider, method, params })
      };
      provider.getLatestBlockhash = ()=>getLatestBlockhash({ blockchain });
      provider.signAndSendTransaction = async (transaction)=>signAndSendTransaction({ blockchain, params: transaction, provider });
      provider.simulateTransaction = async (transaction)=>simulateTransaction({ blockchain, params: transaction, provider });
      provider.getSignatureStatus = async (signature)=>getSignatureStatus({ blockchain, signature, provider });
      provider.getConfirmedTransaction = async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider });
      provider.getTransaction = async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider });
    }

    window._solana = {
      ...window.solana,
      connect: ()=>{
        return connect({
          blockchain, provider
        })
      },
      on: on$2,
      removeListener: removeListener$1,
      request: (payload) => {
        return request({
          request: payload,
        })
      },
      getLatestBlockhash: ()=>getLatestBlockhash({ blockchain }),
      signAndSendTransaction: async (transaction)=>signAndSendTransaction({ blockchain, params: transaction, provider }),
      getSignatureStatus: async (signature)=>getSignatureStatus({ blockchain, signature, provider }),
      simulateTransaction: async (transaction)=>simulateTransaction({ blockchain, params: transaction, provider }),
      getConfirmedTransaction: async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider }),
      getTransaction: async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider }),
      signMessage: (message)=>sign({ blockchain, params: [message], provider }).then((signature)=>{ return { signature } }),
    };

    return configuration
  };

  let events$1 = {};

  let triggerEvent$1 = (eventName, values) => {
    if(events$1[eventName] == undefined) { return }
    events$1[eventName].forEach(function (callback) {
      callback.apply(null, values);
    });
  };

  let on$1 = (eventName, callback) => {
    if (events$1[eventName] === undefined) {
      events$1[eventName] = [];
    }
    events$1[eventName].push(callback);
  };

  let off = (eventName) => {
    if (events$1[eventName]) {
      events$1[eventName] = [];
    }
  };

  function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let mock$2 = ({ configuration, window }) => {

    if(typeof _optionalChain$2([configuration, 'optionalAccess', _ => _.connector]) == 'undefined') { throw('You need to pass a WalletConnect connector instance when mocking WalletConnect!') }
    if(configuration.connector.instance){ return configuration.connector.instance }

    setWalletConnectClass(configuration.connector);
    let instance = configuration.connector.instance = new configuration.connector();

    instance.createSession = function(){ };
    
    instance.sendCustomRequest = async function(options){
      return await window._ethereum.request(options)
    };

    instance.connect = async function(){
      let accounts = await window._ethereum.request({ method: 'eth_accounts' });
      let chainId = await window._ethereum.request({ method: 'net_version' });

      return {
        accounts,
        chainId
      }
    };
    
    instance.on = on$1;
    
    instance.off = off;

    instance.sendTransaction = async function(transaction){
      return await window._ethereum.request({ method: 'eth_sendTransaction', params: [transaction] })
    };

    instance.signPersonalMessage = async function(params){
      return await window._ethereum.request({ method: 'eth_sign', params: [params[1], params[0]] })
    };
  };

  let events = {};

  let triggerEvent = (eventName, value) => {
    if(events[eventName] == undefined) { return }
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

  let removeListener = (eventName, callback) => {
    if (events[eventName]) {
      let index = events[eventName].indexOf(callback);
      if (index >= 0) {
        events[eventName].splice(index, 1);
      }
    }
  };

  function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let mock$1 = ({ configuration, window }) => {

    if(typeof _optionalChain$1([configuration, 'optionalAccess', _ => _.connector]) == 'undefined') { throw('You need to pass a WalletLink connector instance when mocking WalletLink!') }
    if(configuration.connector.instance){ return configuration.connector.instance }

    setWalletLinkClass(configuration.connector);
    let instance = configuration.connector.instance = new configuration.connector();

    instance.enable = async function(){
      let accounts = await window._ethereum.request({ method: 'eth_accounts' });
      return accounts
    };

    instance._relayProvider = async function() {
      return {
        setConnectDisabled: ()=>{}
      }
    };

    instance.getChainId = async function() {
      const blockchain = Blockchains__default['default'].findById(await window._ethereum.request({ method: 'eth_chainId' }));
      return blockchain.networkId
    };

    instance.request = window._ethereum.request;
    
    instance.on = on;
    instance.removeListener = removeListener;
  };

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  let getBlockchain = (configuration) => {
    if (typeof configuration === 'string') {
      return configuration
    } else if (typeof configuration === 'object' && !Array.isArray(configuration)) {
      return configuration.blockchain
    } else {
      raise('Web3Mock: Unknown mock configuration type!');
    }
  };

  let apiIsMissing = (type, configuration) => {
    if(supported.evm.includes(configuration.blockchain)) {
      if (
        typeof configuration[type] == 'undefined' ||
        typeof configuration[type].method == 'undefined'
      ) {
        return false
      }
      return configuration[type] && _optionalChain([configuration, 'access', _ => _[type], 'optionalAccess', _2 => _2.api]) === undefined
    } else if (supported.svm.includes(configuration.blockchain)) {
      if(type == 'transaction') {
        return _optionalChain([configuration, 'access', _3 => _3.transaction, 'optionalAccess', _4 => _4.instructions, 'optionalAccess', _5 => _5.every, 'call', _6 => _6((instruction)=>!instruction.api)])
      } else if(type == 'simulate') {
        return _optionalChain([configuration, 'access', _7 => _7.simulate, 'optionalAccess', _8 => _8.instructions, 'optionalAccess', _9 => _9.every, 'call', _10 => _10((instruction)=>!instruction.api)])
      } else {
        return false
      }
    }
  };

  let apiMissingErrorText = (type, configuration) => {
    let configurationDuplicate = configuration;
    if(configuration.provider) { configurationDuplicate.provider = "PROVIDER"; }

    let suggestedConfiguration;
    if(supported.evm.includes(configuration.blockchain)) {
      suggestedConfiguration = Object.assign(configurationDuplicate, {
        [type]: Object.assign(configurationDuplicate[type], { api: ['PLACE API HERE'] }),
      });
    } else if (supported.svm.includes(configuration.blockchain)) {
      suggestedConfiguration = configurationDuplicate;
      if(type == 'transaction') {
        suggestedConfiguration.transaction.instructions = suggestedConfiguration.transaction.instructions.map((instruction)=>Object.assign(instruction, { api: 'PLACE API HERE' }));
      } else if(type == 'simulate'){
        suggestedConfiguration.simulate.instructions = suggestedConfiguration.simulate.instructions.map((instruction)=>Object.assign(instruction, { api: 'PLACE API HERE' }));
      }
    }
    return (
      'Web3Mock: Please provide the api for the ' +
      type +
      ': ' +
      JSON.stringify(suggestedConfiguration)
    )
  };

  let preflight = (configuration) => {
    if (configuration === undefined || configuration.length === 0) {
      raise('Web3Mock: No mock defined!');
    } else if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
      raise('Web3Mock: Mock configuration is empty!');
    } else if (typeof configuration != 'string' && typeof configuration != 'object') {
      raise('Web3Mock: Unknown mock configuration type!');
    }
    if (apiIsMissing('request', configuration)) {
      raise(apiMissingErrorText('request', configuration));
    } else if (apiIsMissing('transaction', configuration)) {
      raise(apiMissingErrorText('transaction', configuration));
    } else if (apiIsMissing('simulate', configuration)) {
      raise(apiMissingErrorText('simulate', configuration));
    } else if (apiIsMissing('estimate', configuration)) {
      raise(apiMissingErrorText('estimate', configuration));
    }
  };

  let spy = (mock) => {
    if (typeof mock != 'object') {
      return mock
    }
    
    let spy = ()=>{};
    if(mock) { Object.keys(mock).forEach((key)=>{ spy[key] = mock[key]; }); }

    let calls = [];
    spy.callCount = 0;
    mock.calls = spy.calls = {
      add: (call) => {
        spy.callCount++;
        calls.push(call);
      },
      all: () => calls,
      count: () => calls.length,
    };
    spy.getCalls = (a)=>{ return calls };
    spy.getCall = ()=>{ return calls[calls.length-1] };
    spy.calledWithExactly = ()=>{};
    spy.printf = (string)=> { 
      string = string.replace("%n", "Web3Mock");
      string = string.replace("%C", calls.map((call)=>{return JSON.stringify(call)}).join("\n"));
      return string
    };
    spy.called = ()=> { return calls.length > 1 };
    spy.calledOnce = ()=> { return calls.length == 1 };
    return spy
  };

  let mockWallet = ({ blockchain, configuration, window }) => {
    let wallet = configuration.wallet;
    switch (wallet) {
      case 'metamask':
        window.ethereum = window._ethereum;
        window.ethereum.isMetaMask = true;
        break
      case 'coinbase':
        window.ethereum = window._ethereum;
        window.ethereum.isCoinbaseWallet = true;
        window.ethereum.isWalletLink = true;
        break
      case 'phantom':
        window.solana = window._solana;
        window.solana.isPhantom = true;
        window.phantom = window.solana;
        break
      case 'walletconnect':
        mock$2({ configuration, window });
        break
      case 'walletlink':
        mock$1({ configuration, window });
        break
      default:
        if(supported.evm.includes(blockchain)) {
          window.ethereum = window._ethereum;
        } else if(supported.svm.includes(blockchain)) {
          window.solana = window._solana;
        }
    }
  };

  let mockBlockchain = ({ blockchain, configuration, window, provider }) => {
    if(supported.evm.includes(blockchain)) {

      
      return mock$4({ blockchain, configuration, window, provider })
      

    } else if(supported.svm.includes(blockchain)) {

      
      return mock$3({ blockchain, configuration, window, provider })
      
      
    } else {
      raise('Web3Mock: Unknown blockchain!');
    }
  };

  let mock = (configuration, call) => {
    preflight(configuration);

    let window = getWindow(configuration);
    let blockchain = getBlockchain(configuration);
    let mock;

    if (configuration.transaction) {
      configuration.transaction._id = getRandomTransactionHash(blockchain);
    }
    
    (configuration.providers || [configuration.provider]).forEach((provider)=>{
      if(provider) { provider._blockchain = blockchain; }
      mock = mockBlockchain({ blockchain, configuration, window, provider });
      mocks.unshift(mock);
    });
    
    mockWallet({ blockchain, configuration, window });

    if (configuration.require) { requireMock(configuration.require); }

    return spy(mock)
  };

  var trigger = (eventName, value) => {
    
    
    triggerEvent$3(eventName, value);
    triggerEvent$2(eventName, value);


    triggerEvent$1(eventName, value);
    triggerEvent(eventName, value);
  };

  exports.anything = anything;
  exports.confirm = confirm;
  exports.connect = setCurrentNetwork;
  exports.fail = fail;
  exports.getCurrentBlock = getCurrentBlock;
  exports.increaseBlock = increaseBlock;
  exports.mock = mock;
  exports.normalize = normalize;
  exports.replace = replace;
  exports.resetCurrentBlock = resetCurrentBlock;
  exports.resetMocks = resetMocks;
  exports.trigger = trigger;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
