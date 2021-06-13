(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Mock = {}));
}(this, (function (exports) { 'use strict';

  var Web3Mock = ({ blockchain }) => {

    

  };

  exports.Web3Mock = Web3Mock;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
