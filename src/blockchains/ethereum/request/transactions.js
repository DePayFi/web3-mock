import normalize from '../../../helpers/normalize'
import { ethers } from 'ethers'

let mocks;

let mockTransactions = function(configuration) {
  if(configuration != undefined) { mocks = {} }
  if(configuration === undefined) { return }
  let configurationWithLowerCaseAddress = {}
  for (const [address, configuration] of Object.entries(configuration)) {
    configurationWithLowerCaseAddress[normalize(address)] = configuration
  }
  Object.assign(mocks, configurationWithLowerCaseAddress)
}

let getContract = function({ params, mock, window }){
  return new ethers.Contract(
    params.to,
    mock.abi,
    new ethers.providers.Web3Provider(window.ethereum)
  );
}

let getContractFunction = function({ data, params, mock, window }) {
  let contract = getContract({ params, mock, window });
  let methodSelector = data.split('000000000000000000000000')[0];
  return contract.interface.getFunction(methodSelector);
}

let decodeTransactionArguments = function({ params, mock, window }){
  let data = params.data;
  let contract = getContract({ params, mock, window })
  let contractFunction = getContractFunction({ data, params, mock, window });
  if(mock?.method && contractFunction.name != mock.method) { return undefined }
  return contract.interface.decodeFunctionData(contractFunction, data);
}

let findMock = function({ params, mocks, window }) {
  params = params[0];
  let mock = mocks[params.to];
  if(mock?.value && ethers.BigNumber.from(params.value).toString() !== mock.value) { return undefined }
  if(mock?.from && normalize(params.from) !== normalize(mock.from)) { return undefined }
  if(params.data !== undefined) {
    if (mock.abi === undefined) {
      throw 'Web3Mock Ethereum transactions: Please mock the abi of the contract: { transactions: { "'+params.to+'": { abi: ABI } } }'
    } else {
      let transactionArguments = decodeTransactionArguments({ params, mock, window })
      let allArgumentsMatch = Object.keys(mock?.params).every((key)=>{
        if(mock.params[key]) {
          return JSON.stringify(normalize(mock.params[key])) == JSON.stringify(normalize(transactionArguments[key]))
        } else {
          return true
        }
      })
      if(!allArgumentsMatch) { return undefined }
    }
  }
  return mock;
}

let transactionHash = function() {
  return '0xbb8d9e2262cd2d93d9bf7854d35f8e016dd985e7b3eb715d0d7faf7290a0ff4d'
}

let sendTransaction = function({ params, window }){
  
  if(mocks === undefined) {
    return Promise.resolve(transactionHash());
  } else {
    let mock = findMock({ params, mocks, window });
    if(mock) {
      return Promise.resolve(transactionHash())
    } else if (params[0].data) {
      let mock = mocks[params[0].to];
      if(mock && mock.abi) {
        let transactionArguments = decodeTransactionArguments({ params: params[0], mock, window });
        let contractFunction = getContractFunction({ data: params[0].data, params: params[0], mock, window });
        let transactionArgumentsToParams = {};
        Object.keys(transactionArguments).forEach((key)=>{
          if(key.match(/\D/)) {
            transactionArgumentsToParams[key] = normalize(transactionArguments[key])
          }
        });
        throw 'Web3Mock Ethereum transactions: Please mock the contract call transaction: { transactions: { "'+params[0].to+'": { method: "'+contractFunction.name+'", params: '+JSON.stringify(transactionArgumentsToParams)+' } }'
      } else {
        throw 'Web3Mock Ethereum transactions: Please mock the contract call transaction: { transactions: { "'+params[0].to+'": { } }'
      }
    } else {
      throw 'Web3Mock Ethereum transactions: Please mock: { transactions: { "'+params[0].to+'": { "from": "'+params[0].from+'" , "value": "1000000000000000000"} }'
    }
  }
}

export { sendTransaction, mockTransactions }
