import { getRandomTransactionHash } from '../../transaction.js'
import { getCurrentBlock } from '../../block'

const getLatestBlockhash = ({ blockchain })=>{
  return({
    blockhash: getRandomTransactionHash(blockchain),
    lastValidBlockHeight: getCurrentBlock()
  })
}

export {
  getLatestBlockhash
}
