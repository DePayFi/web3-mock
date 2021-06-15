(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Mock = {}, global.ethers));
}(this, (function (exports, ethers) { 'use strict';

  let mocks;

  let mockCalls = function(configuration) {
    mocks = {};
    if(configuration === undefined) { return }
    let configurationWithLowerCaseAddress = {};
    for (const [address, configuration] of Object.entries(configuration)) {
      configurationWithLowerCaseAddress[address.toLowerCase()] = configuration;
    }
    Object.assign(mocks, configurationWithLowerCaseAddress);
  };

  let call = function({ params, window }) {
    let callParams = params[0];
    let address = callParams.to.toLowerCase();
    if(mocks[address] === undefined) {
      throw 'Web3Mock Ethereum request call: Please mock the contract at: '+address
    } else if (mocks[address].abi === undefined) {
      throw 'Web3Mock Ethereum request call: Please mock the abi of the contract at: '+address
    } else {
      let data = callParams.data;
      let methodSelector = data.split('000000000000000000000000')[0];
      let contract = new ethers.ethers.Contract(
        address,
        mocks[address].abi,
        new ethers.ethers.providers.Web3Provider(window.ethereum)
      );

      let contractFunction = contract.interface.getFunction(methodSelector);
      if (mocks[address][contractFunction.name]) {
        let callMock = mocks[address][contractFunction.name];
        let callArguments = contract.interface.decodeFunctionData(contractFunction, data);
        
        if(callArguments !== undefined) {
          if(typeof callMock === 'object' && !Array.isArray(callMock)) {
            if(callArguments.length === 1) {
              callMock = callMock[callArguments[0]];
            } else {
              let mappedCallArguments = callArguments.map((argument)=>{
                if(argument.toString){
                  return argument.toString().toLowerCase()
                } else if (typeof argument === 'string' && argument.match('0x')) {
                  return argument.toLowerCase()
                } else {
                  return argument
                }
              });
              callMock = callMock[mappedCallArguments];
              if(callMock === undefined) {
                throw 'Web3Mock Ethereum request call: Mock the following contract call: { "'+ address + '":' + ' { [['+ mappedCallArguments.join(',') + ']] : "Your Value" } }'
              }
            }
          }
        }
        
        callMock = [callMock];
        let encodedResult = contract.interface.encodeFunctionResult(contractFunction.name, callMock);
        return Promise.resolve(encodedResult)
      } else {
        throw 'Web3Mock Ethereum request call: Mock the following contract call: { "'+ address + '":' + ' { "'+ contractFunction.name + '" : "Your Value" } }'
      }
    }
  };

  let request = ({ request, window }) => {
    switch (request.method) {

      case 'eth_chainId':
        return Promise.resolve('0x1')

      case 'eth_getBalance':
        return Promise.resolve(ethers.ethers.BigNumber.from('0'))

      case 'net_version':
        return Promise.resolve(1)

      case 'eth_requestAccounts':
      case 'eth_accounts':
        return Promise.resolve([])

      case 'eth_estimateGas':
        return Promise.resolve('0x2c4a0')

      case 'eth_blockNumber':
        return Promise.resolve('0x5daf3b')

      case 'eth_call':
        return call({ params: request.params, window })

      default:
        throw 'Web3Mock Ethereum request: Unknown request method!'
    }
  };

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// https://docs.metamask.io/guide/ethereum-provider.html


  var Ethereum = ({ configuration, window }) => {

    mockCalls(_optionalChain([configuration, 'optionalAccess', _ => _.calls]));

    window.ethereum = { 
      ...window.ethereum,
      request: (configuration)=>request({ request: configuration, window })
    };
  };

  let mock = function({ configuration, window }){
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
        Ethereum({ configuration: configuration['ethereum'], window });
        break
      default:
        throw 'Web3Mock: Unknown blockchain!'
    }
  };

  var Web3Mock = ({ mocks, window = window }) => {
    if (mocks === undefined || mocks.length === 0) {
      throw 'Web3Mock: No mocks defined!'
    }

    if(mocks instanceof Array) {
      mocks.forEach((configuration)=>{ 
        if(typeof configuration === 'object' && Object.keys(configuration).length === 0) {
          throw 'Web3Mock: Mock configurations are empty!'
        }
        mock({ configuration, window }); 
      });
    } else if (typeof mocks === 'string') {
      mock({ configuration: mocks, window });
    } else if (typeof mocks === 'object') {
      if(Object.keys(mocks).length === 0) {
        throw 'Web3Mock: Mock configurations are empty!'
      }
      for (const [blockchain, configuration] of Object.entries(mocks)) {
        mock({ configuration: {[blockchain]: configuration}, window });
      }
    } else {
      throw 'Web3Mock: Unknown mock configuration type!'
    }

  };

  exports.Web3Mock = Web3Mock;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
