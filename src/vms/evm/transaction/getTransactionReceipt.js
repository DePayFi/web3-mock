import getRandomTransactionHash from './getRandomTransactionHash'
import { ethers } from 'ethers'
import { findMockByTransactionHash } from '../findMock'
import { getCurrentBlock } from '../../../block'

export default (hash) => {
  let mock = findMockByTransactionHash(hash)

  if (mock) {
    return Promise.resolve({
      transactionHash: hash,
      transactionIndex: '0x1',
      blockNumber: ethers.BigNumber.from(mock.transaction._confirmedAtBlock || getCurrentBlock())
        ._hex,
      blockHash: getRandomTransactionHash(),
      cumulativeGasUsed: '0x33bc',
      gasUsed: '0x4dc',
      logs: [],
      logsBloom: '0x0000000000000000000000000000000000000000',
      status: '0x1',
    })
  } else {
    return Promise.resolve(null)
  }
}
