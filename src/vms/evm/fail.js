import { getCurrentBlock } from '../../block'

let fail = (transaction) => {
  transaction._failed = true
  return transaction
}

export { fail }
