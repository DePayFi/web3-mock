import { Connection, struct, u8, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@depay/solana-web3.js'
import { mock, resetMocks, anything } from 'dist/esm/index.svm'
import { supported } from "src/blockchains"

describe('mocks solana simulations', ()=> {

  supported.svm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      const POOL_INFO = struct([
        u8("instruction"),
        u8("simulateType"),
      ])
      
      beforeEach(resetMocks)

      it('mocks a simple request', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')
        let logs = ['Program log: GetPoolData: {"status":1,"coin_decimals":9,"pc_decimals":6,"lp_decimals":9,"pool_pc_amount":12754312776324,"pool_coin_amount":379132082877028,"pool_lp_supply":263721383546103,"pool_open_time":0,"amm_id":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}']

        let requestMock = mock({
          provider: connection,
          blockchain,
          simulate: {
            from: "RaydiumSimuLateTransaction11111111111111111",
            instructions:[{
              to: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
              api: POOL_INFO,
              params: {
                instruction: 12,
                simulateType: 0
              },
            }],
            return: { logs }
          }
        })

        const data = Buffer.alloc(POOL_INFO.span)
        POOL_INFO.encode({ instruction: 12, simulateType: 0 }, data)

        const keys = [
          { pubkey: new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"), isWritable: false, isSigner: false },
        ]

        const programId = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
        const instruction = new TransactionInstruction({
          programId,
          keys,
          data,
        })

        const instructions = []
        instructions.push(instruction)

        const feePayer = new PublicKey("RaydiumSimuLateTransaction11111111111111111")

        const messageV0 = new TransactionMessage({
          payerKey: feePayer,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)

        let result = await connection.simulateTransaction(transactionV0)
        expect(result.value.logs).toEqual(logs)
      })

      it('fails and tells you to mock the simulation if is has not been mocked', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')
        mock({ blockchain, provider: connection })

        const data = Buffer.alloc(POOL_INFO.span)
        POOL_INFO.encode({ instruction: 12, simulateType: 0 }, data)

        const keys = [
          { pubkey: new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"), isWritable: false, isSigner: false },
        ]

        const programId = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
        const instruction = new TransactionInstruction({
          programId,
          keys,
          data,
        })

        const feePayer = new PublicKey("RaydiumSimuLateTransaction11111111111111111")

        const instructions = []
        instructions.push(instruction)

        const messageV0 = new TransactionMessage({
          payerKey: feePayer,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)

        await expect(
          connection.simulateTransaction(transactionV0)
        ).rejects.toEqual(
          'Web3Mock: Please mock the simulation: {"blockchain":"solana","simulate":{"from":"RaydiumSimuLateTransaction11111111111111111","instructions":[{"to":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","api":"API HERE"}],"return":"YOUR RETURN HERE"}}'
        )
      })

      it('fails and tells you to mock simulation if params are wrong', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')
        let logs = ['Program log: GetPoolData: {"status":1,"coin_decimals":9,"pc_decimals":6,"lp_decimals":9,"pool_pc_amount":12754312776324,"pool_coin_amount":379132082877028,"pool_lp_supply":263721383546103,"pool_open_time":0,"amm_id":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}']

        let requestMock = mock({
          provider: connection,
          blockchain,
          simulate: {
            from: "RaydiumSimuLateTransaction11111111111111111",
            instructions:[{
              to: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
              api: POOL_INFO,
              params: {
                instruction: 11,
                simulateType: 0
              },
            }],
            return: { logs }
          }
        })

        const data = Buffer.alloc(POOL_INFO.span)
        POOL_INFO.encode({ instruction: 12, simulateType: 0 }, data)

        const keys = [
          { pubkey: new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"), isWritable: false, isSigner: false },
          { pubkey: new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"), isWritable: false, isSigner: false },
        ]

        const programId = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
        const instruction = new TransactionInstruction({
          programId,
          keys,
          data,
        })

        const feePayer = new PublicKey("RaydiumSimuLateTransaction11111111111111111")

        const instructions = []
        instructions.push(instruction)

        const messageV0 = new TransactionMessage({
          payerKey: feePayer,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)

        await expect(
          connection.simulateTransaction(transactionV0)
        ).rejects.toEqual(
          'Web3Mock: Please mock the simulation: {"blockchain":"solana","simulate":{"from":"RaydiumSimuLateTransaction11111111111111111","instructions":[{"to":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","api":"API HERE"}],"return":"YOUR RETURN HERE"}}'
        )
      })
    })
  })
})
