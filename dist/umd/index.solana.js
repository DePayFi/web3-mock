(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers'), require('@depay/solana-web3.js'), require('@depay/web3-blockchains')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ethers', '@depay/solana-web3.js', '@depay/web3-blockchains'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Mock = {}, global.ethers, global.SolanaWeb3js, global.Web3Blockchains));
}(this, (function (exports, ethers, solanaWeb3_js, Blockchains) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Blockchains__default = /*#__PURE__*/_interopDefaultLegacy(Blockchains);

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

  let setBlockData = (number, data) => {
    blockData[number] = data;
  };

  let resetBlockData = ()=> {
    blockData = {};
  };

  let confirm$1 = (transaction) => {
    transaction._confirmedAtBlock = getCurrentBlock();
    return transaction
  };

  var raise = (msg)=>{
    console.log(msg);
    throw(msg)
  };

  function _optionalChain$a(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }let getWindow = (configuration) => {
    if (_optionalChain$a([configuration, 'optionalAccess', _ => _.window])) return configuration.window
    if (typeof global == 'object') return global
    if (typeof cy == 'object') return cy.window().specWindow.window
    if (typeof window == 'object') return window
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

  let supported = ['solana'];
  supported.evm = [];
  supported.solana = ['solana'];

  function _optionalChain$9(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  var confirm = (mock) => {
    if (_optionalChain$9([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2._id])) {
      mock.transaction._confirmed = true;
      if(supported.evm.includes(mock.blockchain)) ; else if(supported.solana.includes(mock.blockchain)) {


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
    } else if (supported.solana.includes(blockchain)) {
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

  let fail$1 = (transaction, reason) => {
    transaction._confirmedAtBlock = getCurrentBlock();
    transaction._failed = true;
    transaction._failedReason = reason;
    return transaction
  };

  function _optionalChain$8(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  var fail = (mock, reason) => {
    if (_optionalChain$8([mock, 'optionalAccess', _ => _.transaction, 'optionalAccess', _2 => _2._id])) {
      mock.transaction._failed = true;
      mock.transaction._confirmed = false;
      if(supported.evm.includes(mock.blockchain)) ; else if(supported.solana.includes(mock.blockchain)) {


        fail$1(mock.transaction, reason);


      } else {
        raise('Web3Mock: Unknown blockchain!');
      }
      increaseBlock();
    } else {
      raise('Web3Mock: Given mock is not a sent transaction: ' + JSON.stringify(mock));
    }
  };

  function _optionalChain$7(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }let normalize = function (input) {
    if (input instanceof Array) {
      return input.map((element) => normalize(element))
    } else if (typeof input === 'undefined') {
      return input
    } else if (typeof input === 'object' && input._isBigNumber) {
      return input.toString()
    } else {
      if (_optionalChain$7([input, 'optionalAccess', _ => _.toString])) {
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

  function _optionalChain$6(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
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
    let requiredFrom = _optionalChain$6([transaction, 'optionalAccess', _ => _.message, 'optionalAccess', _2 => _2.staticAccountKeys, 'optionalAccess', _3 => _3.length]) ? transaction.message.staticAccountKeys[0].toString() : undefined;

    return (
      (mock[type].from && normalize(requiredFrom) !== normalize(mock[type].from))
    )
  };

  let mockInstructionsMatch = (mockedInstruction, instruction)=>{
    if(_optionalChain$6([mockedInstruction, 'optionalAccess', _4 => _4.params]) == anything) { return true }
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
    if(_optionalChain$6([mockedInstruction, 'optionalAccess', _5 => _5.keys]) == anything) { return true }
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
      (_optionalChain$6([mock, 'access', _6 => _6[type], 'optionalAccess', _7 => _7.instructions]) && mock[type].instructions.some((mockedInstruction)=>{
        return !(_optionalChain$6([transaction, 'optionalAccess', _8 => _8.message, 'optionalAccess', _9 => _9.compiledInstructions])).some((instruction)=>{
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
      if (normalize(_optionalChain$6([mock, 'access', _10 => _10[type], 'optionalAccess', _11 => _11.to])) !== normalize(params[0])) {
        return
      }
      return mock
    })
  };

  let findMockByTransactionHash = (hash) => {
    return mocks.find((mock) => {
      return _optionalChain$6([mock, 'optionalAccess', _12 => _12.transaction, 'optionalAccess', _13 => _13._id]) == hash && (
        _optionalChain$6([mock, 'optionalAccess', _14 => _14.transaction, 'optionalAccess', _15 => _15._confirmed]) || _optionalChain$6([mock, 'optionalAccess', _16 => _16.transaction, 'optionalAccess', _17 => _17._failed])
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

  function _optionalChain$5(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let balance = function ({ blockchain, params, provider }) {
    let mock = findMock({ blockchain, type: 'balance', params, provider });

    if (mock && _optionalChain$5([mock, 'access', _ => _.balance, 'optionalAccess', _2 => _2.return]) != undefined) {
      mock.calls.add(params);
      if (_optionalChain$5([mock, 'optionalAccess', _3 => _3.balance, 'optionalAccess', _4 => _4.return]) instanceof Error) {
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
    } else {
      let response = marshalValue(mock.request.return);

      if(mock.request.api) {
        let buffer = solanaWeb3_js.Buffer.alloc(mock.request.api.span < 0 ? 1000 : mock.request.api.span);
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

  let setCurrentNetwork = (network)=>{
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
        transaction: {},
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
    } else if (supported.solana.includes(configuration.blockchain)) {
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
    } else if (supported.solana.includes(configuration.blockchain)) {
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
        } else if(supported.solana.includes(blockchain)) {
          window.solana = window._solana;
        }
    }
  };

  let mockBlockchain = ({ blockchain, configuration, window, provider }) => {
    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


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
