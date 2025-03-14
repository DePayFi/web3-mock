import { getCurrentBlock } from '../../block'

let fail = (transaction, reason) => {
  transaction._confirmedAtBlock = getCurrentBlock()
  transaction._failed = true
  transaction._failedReason = reason
  return transaction
}

export { fail }
