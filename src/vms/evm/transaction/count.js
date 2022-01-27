import { ethers } from 'ethers'

let count = {}

let increaseTransactionCount = (address) => {
  if(count[address] == undefined) { count[address] = 0 }
  count[address] += 1
}

let getTransactionCount = (address) => {
  if(count[address] == undefined) { count[address] = 0 }
  return ethers.BigNumber.from(count[address].toString())._hex
}

let resetTransactionCount = ()=> {
  count = {}
}

export { getTransactionCount, increaseTransactionCount, resetTransactionCount }
