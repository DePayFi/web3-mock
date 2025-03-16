import { getRandomTransactionHash } from '../../../transaction.js'
import { ethers } from 'ethers'
import { findMockByTransactionHash } from '../findMock'
import { getCurrentBlock } from '../../../block'

export default (hash) => {
  let mock = findMockByTransactionHash(hash)

  if (mock) {
    return Promise.resolve({
        from: mock?.transaction?.from,
        to: mock?.transaction?.to,
        transactionHash: hash,
        transactionIndex: '0x1',
        blockNumber: BigInt(mock.transaction._confirmedAtBlock || getCurrentBlock())
          ._hex,
        blockHash: getRandomTransactionHash(mock.blockchain),
        cumulativeGasUsed: '0x33bc',
        gasUsed: '0x4dc',
        logs: mock?.transaction?.logs || [],
        logsBloom: '0x0000000000000000000000000000000000000000',
        status: mock.transaction?._failed ? '0x0' : '0x1',
      })
  } else {
    return Promise.resolve(null)
  }
}
