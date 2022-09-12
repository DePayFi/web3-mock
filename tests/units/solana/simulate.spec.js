import { Connection, struct, u8, PublicKey, Transaction, TransactionInstruction } from '@depay/solana-web3.js'
import { mock, resetMocks, anything } from 'src'
import { supported } from "src/blockchains"

describe('mocks solana simulations', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      const POOL_INFO = struct([
        u8("instruction"),
        u8("simulateType"),
      ])
      
      beforeEach(resetMocks)

      it('mocks a simple request', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let requestMock = mock({
          provider: connection,
          blockchain,
          simulate: {
            from: "RaydiumSimuLateTransaction11111111111111111",
            instructions:[{
              to: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
              api: POOL_INFO
            }],
            params: {
              instruction: 12,
              simulateType: 0
            }
          }
        })

        const data = Buffer.alloc(POOL_INFO.span)
        POOL_INFO.encode({ instruction: 12, simulateType: 0 }, data)

        const keys = [
          { pubkey: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2", isWritable: false, isSigner: false },
          { pubkey: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1", isWritable: false, isSigner: false },
          { pubkey: "HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc", isWritable: false, isSigner: false },
          { pubkey: "DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz", isWritable: false, isSigner: false },
          { pubkey: "HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz", isWritable: false, isSigner: false },
          { pubkey: "8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu", isWritable: false, isSigner: false },
          { pubkey: "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT", isWritable: false, isSigner: false },
        ]

        const programId = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
        const instruction = new TransactionInstruction({
          programId,
          keys,
          data,
        })

        const feePayer = new PublicKey("RaydiumSimuLateTransaction11111111111111111")

        let transaction = new Transaction({ feePayer })
        transaction.add(instruction)

        let result = await connection.simulateTransaction(transaction)

        console.log("result", result)
      })
    })
  })
});
