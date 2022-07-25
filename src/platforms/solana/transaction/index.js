import raise from '../../../raise'
import { findMock, findMockByTransactionHash } from '../findMock'
import { getCurrentBlock } from '../../../block'

let signAndSendTransaction = ({ blockchain, params, provider }) => {
  let mock = findMock({ type: 'transaction', params, provider })

  if(mock) {
    mock.calls.add(params)

    if(mock.transaction.delay) {
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          if (mock.transaction.return instanceof Error) {
            reject(mock.transaction.return)
          } else {
            resolve({
              publicKey: params.feePayer.toString(),
              signature: mock.transaction._id
            })
          }
        }, mock.transaction.delay)
      })
    } else {
      if (mock.transaction.return instanceof Error) {
        return Promise.reject(mock.transaction.return)
      } else {
        return Promise.resolve({
          publicKey: params.feePayer.toString(),
          signature: mock.transaction._id
        })
      }
    }
  } else {
    raise(
      'Web3Mock: Please mock the following transaction: ' +
      JSON.stringify({
        blockchain,
        transaction: getTransactionToBeMocked(params),
      })
    )
  }
}

let getTransactionToBeMocked = (params) =>{

  return {
    from: params?.feePayer?.toString(),
    instructions: params.instructions.map((instruction)=>{
      return {
        to: instruction?.programId?.toString(),
        api: ["API HERE"],
        data: { value: "HERE" }
      }
    })
  }
}

let getSignatureStatus = ({ signature }) => {
  let mock = findMockByTransactionHash(signature)

  if(mock && mock.transaction._confirmedAtBlock) {
    return({
      context: {apiVersion: '1.10.31', slot: 143064206},
      value: {
        confirmationStatus: "confirmed",
        confirmations: getCurrentBlock()-mock.transaction._confirmedAtBlock-1,
        err: null,
        slot: 143062809,
        status: { Ok: null }
      }
    })
  } else {
    return({
      context: {apiVersion: '1.10.31', slot: 143064206},
      value: null
    })
  }
}

export { 
  signAndSendTransaction,
  getSignatureStatus
}
