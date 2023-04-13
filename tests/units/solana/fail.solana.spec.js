import { ethers } from 'ethers'
import { mock, resetMocks, fail } from 'dist/esm/index.solana'
import { supported } from "src/blockchains"
import { Connection, TransactionInstruction, TransactionMessage, VersionedTransaction, SystemProgram, PublicKey, struct, u32, u64, } from '@depay/solana-web3.js'

describe('mock solana transaction failures/reverts', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('allows to fail a transaction', async ()=> {
        
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

        fail(mockedTransaction)

        let status = await window.solana.getSignatureStatus(signedTransaction.signature)

        expect(status.value.confirmationStatus).toEqual('confirmed')
        expect(status.value.confirmations).toEqual(0)
        expect(status.value.err).not.toEqual(null)
        expect(status.value.status.Err).not.toEqual(null)
      })
    })
  })
})
