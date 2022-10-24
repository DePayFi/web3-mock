import { findMockByTransactionHash } from './findMock'
import { getCurrentBlock } from '../../block'
import { increaseTransactionCount } from './transaction/count'

let confirm = (transaction) => {
  let mock = findMockByTransactionHash(transaction._id)
  transaction._confirmedAtBlock = getCurrentBlock()
  if(mock && mock._from) { increaseTransactionCount(mock._from) }
  return transaction
}

export { confirm }
