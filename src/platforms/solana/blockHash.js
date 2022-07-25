import { getRandomTransactionHash } from '../../transaction.js'

const getRecentBlockhash = ({ blockchain })=>{
  return({
    blockhash: getRandomTransactionHash(blockchain),
    feeCalculator: {
      lamportsPerSignature: 5000
    }
  })
}

export {
  getRecentBlockhash
}
