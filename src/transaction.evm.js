import { ethers } from 'ethers'
import { supported } from './blockchains.evm'

const getRandomTransactionHash = (blockchain) => {
  if(supported.evm.includes(blockchain)) {
    return ethers.BigNumber.from(
      '1' +
        Array(76)
          .fill()
          .map(() => Math.random().toString()[4])
          .join(''),
    )._hex
  }
}

export {
  getRandomTransactionHash
}
