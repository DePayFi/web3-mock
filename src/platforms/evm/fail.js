import { findMockByTransactionHash } from './findMock'
import { getCurrentBlock } from '../../block'
import { increaseTransactionCount } from './transaction/count'

let fail = (transaction, reason) => {
  let mock = findMockByTransactionHash(transaction._id)
  transaction._confirmedAtBlock = getCurrentBlock()
  transaction._failed = true
  transaction._failedReason = reason
  if(mock && mock._from) { increaseTransactionCount(mock._from) }
  return transaction
}

export { fail }
