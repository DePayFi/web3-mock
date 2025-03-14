import raise from '../../raise'
import { findMock, findMockByTransactionHash } from './findMock'
import { getCurrentBlock } from '../../block'

let signAndSendTransaction = ({ blockchain, params, provider }) => {
  let mock = findMock({ type: 'transaction', params, provider })

  if(mock) {
    mock.calls.add(params)

    const publicKey = params.message.staticAccountKeys[0].toString()

    if(mock.transaction.delay) {
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          if (mock.transaction.return instanceof Error) {
            reject(mock.transaction.return)
          } else {
            resolve({
              publicKey,
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
          publicKey,
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

let getTransactionToBeMocked = (transaction) =>{

  let from = transaction?.message?.staticAccountKeys?.length ? transaction.message.staticAccountKeys[0].toString() : 'FROM'

  return {
    from,
    instructions: (transaction?.message?.compiledInstructions || []).map((instruction)=>{

      let to = transaction?.message?.staticAccountKeys?.length ? transaction.message.staticAccountKeys[instruction.programIdIndex].toString() : 'TO'

      return {
        to,
        api: ["API HERE"],
        params: { value: "HERE" }
      }
    })
  }
}

let getSignatureStatus = ({ signature }) => {
  let mock = findMockByTransactionHash(signature)

  if(mock && mock.transaction._confirmedAtBlock) {
    const confirmations = getCurrentBlock()-mock.transaction._confirmedAtBlock-1
    return({
      context: {apiVersion: '1.10.31', slot: 143064206},
      value: {
        confirmationStatus: confirmations == 0 ? "confirmed" : "finalized",
        confirmations,
        err: mock.transaction._failed ? { InstructionError: [0, 'Error'] } : null,
        slot: 143062809,
        status: mock.transaction._failed ? { Err: { InstructionError: [0, 'Error'] } } : { Ok: null }
      }
    })
  } else {
    return({
      context: {apiVersion: '1.10.31', slot: 143064206},
      value: null
    })
  }
}

let getConfirmedTransaction = ({ signature }) => {
  let mock = findMockByTransactionHash(signature)

  if(mock && mock.transaction._confirmedAtBlock) {
    const confirmations = getCurrentBlock()-mock.transaction._confirmedAtBlock-1
    return({
      blockTime: 1658913018,
      slot: 143351809,
      transaction: {
        signatures: [mock.transaction._id],
        message: {
          compiledInstructions: mock.transaction.compiledInstructions ? mock.transaction.compiledInstructions : []
        }
      },
      meta: {
        err: mock.transaction._failed ? { InstructionError: [0, 'Error'] } : null,
        logMessages: mock.transaction._failedReason ? [mock.transaction._failedReason] : (mock.transaction.logMessages || [])
      }
    })
  } else {
    return(null)
  }
}

export { 
  signAndSendTransaction,
  getSignatureStatus,
  getConfirmedTransaction,
}
