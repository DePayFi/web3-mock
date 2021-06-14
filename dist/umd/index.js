(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Mock = {}, global.ethers));
}(this, (function (exports, ethers) { 'use strict';

  var on = ()=>{

  };

  var request = (request)=>{

    switch(request.method) {
      
      case 'eth_chainId':
        return Promise.resolve('0x1');
      
      case 'eth_getBalance':
        return Promise.resolve(ethers.ethers.BigNumber.from('0'));
      
      case 'net_version':
        return Promise.resolve(1);
     
      case 'eth_requestAccounts':
      case 'eth_accounts':
        return Promise.resolve([]);

      case 'eth_estimateGas':
        return Promise.resolve('0x2c4a0');

      case 'eth_blockNumber':
        return Promise.resolve('0x5daf3b');
     
      default:
        throw('Web3Mock Ethereum request: Unknown request method!')
    }

  };

  // https://docs.metamask.io/guide/ethereum-provider.html


  var Ethereum = ({
    chain = 1,
    window = window
  }) => {

    window.ethereum = { ...window.ethereum,
      request: request,
      on: on
    };

  };

  var Web3Mock = ({
    mocks,
    window = window
  }) => {

    if(mocks === undefined || mocks.length === 0) {
      throw('Web3Mock: No mocks defined!')
    }

    mocks.forEach(function(mock){
      let blockchain;
      
      if(typeof mock === 'string') {
        blockchain = mock;
      } else if (typeof mock === 'object') {
        if(Object.keys(mock).length != 1) {
          throw('Web3Mock: Mock entries are supposed to exactly have 1 key, e.g. mocks: [ { ethereum: ... } ]')
        } else {
          blockchain = Object.keys(mock)[0];
        }
      } else {
        throw('Web3Mock: Unknown mock type!')
      }

      switch(blockchain) {
        case 'ethereum':
          Ethereum({ ...mock, window });
        break
        default:
          throw('Web3Mock: Unknown blockchain!')
      }
    });
  };

  exports.Web3Mock = Web3Mock;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
