import { getCurrentBlock } from '../../../../block'

let confirm = (transaction) => {
  transaction._confirmedAtBlock = getCurrentBlock()
  return transaction
}

export { confirm }
