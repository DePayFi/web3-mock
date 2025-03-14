import { ethers } from 'ethers'
import { mock, resetMocks, fail } from 'dist/esm/index.svm'
import { supported } from "src/blockchains"
import { Connection, TransactionInstruction, TransactionMessage, VersionedTransaction, SystemProgram, PublicKey, struct, u32, u64, } from '@depay/solana-web3.js'

describe('mock solana getConfirmedTransaction', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('provides null if transaction has not been confirmed/failed', async ()=> {
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: '11111111111111111111111111111111',
              api: struct([
                u32('instruction'),
                u64('lamports')
              ])
            }]
          }
        })

        let confirmedTransaction = await window.solana.getConfirmedTransaction(mockedTransaction.transaction._id)

        expect(confirmedTransaction).toEqual(null)
      })

      it('provides failed confirmed transaction', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: '11111111111111111111111111111111',
              api: struct([
                u32('instruction'),
                u64('lamports')
              ])
            }]
          }
        })

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        const instructions = []

        instructions.push(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: 1000000000
          })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        let signedTransaction = await window.solana.signAndSendTransaction(transactionV0)

        fail(mockedTransaction, 'THIS IS THE REASON IT FAILED')

        let confirmedTransaction = await window.solana.getConfirmedTransaction(signedTransaction.signature)

        expect(confirmedTransaction.meta.err).toBeDefined()
        expect(confirmedTransaction.meta.logMessages[0]).toEqual('THIS IS THE REASON IT FAILED')
      })
    })
  })
})
