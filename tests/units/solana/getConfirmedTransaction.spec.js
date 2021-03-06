import { ethers } from 'ethers'
import { mock, resetMocks, fail } from 'src'
import { supported } from "src/blockchains"
import { Connection, Transaction, SystemProgram, PublicKey, struct, u32, u64, } from '@depay/solana-web3.js'

describe('mock solana getConfirmedTransaction', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

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

        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: 1000000000
          })
        )
        
        let signedTransaction = await window.solana.signAndSendTransaction(transaction)

        fail(mockedTransaction, 'THIS IS THE REASON IT FAILED')

        let confirmedTransaction = await window.solana.getConfirmedTransaction(signedTransaction.signature)

        expect(confirmedTransaction.meta.err).toBeDefined()
        expect(confirmedTransaction.meta.logMessages[0]).toEqual('THIS IS THE REASON IT FAILED')
      })
    })
  })
})
