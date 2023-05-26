import { ethers } from 'ethers'
import { Connection, TransactionInstruction, TransactionMessage, VersionedTransaction, SystemProgram, PublicKey, struct, u8, u32, u64, nu64, BN, seq, offset, publicKey } from '@depay/solana-web3.js'
import { mock, resetMocks, confirm, anything, replace } from 'dist/esm/index.solana'
import { Token } from '@depay/web3-tokens'
import { supported } from "src/blockchains"

describe('solana mock transactions', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {
      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('does not mock transactions per default', async ()=> {

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        const instructions = [
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: 1000000000
          })
        ]
        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)

        await expect(
          window.solana.signAndSendTransaction(transactionV0)
        ).rejects.toEqual(
          'Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"params\":{\"value\":\"HERE\"}}]}}'
        )
      })

      it('mocks a simple transaction', async ()=> {
        
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

        const instructions = [
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: 1000000000
          })
        ]
        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        let signedTransaction = await window.solana.signAndSendTransaction(transactionV0)

        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks getting a address table lookup', async ()=> {

        const connection = new Connection('https://api.mainnet-beta.solana.com')

        const altLookupMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getAccountInfo',
            to: 'EYGgx5fYCZtLN2pvnR4Bhn5KpMffKwyHCms4VhjSvF2K',
            return: {
              raw: [
                'AQAAAP//////////lLGICwAAAAAAAZUI+NweiVYgbeIRBEMNzoLMusq6HgZtEwERcVYj1p/XAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpjJclj04kifG7PRApFI4NgwtaE5na/xCEBI572Nvp+FkGm4hX/quBhPtof2NGGMA12sQ53BrrO1WYoPAAAAAAAQ4DaF+OkJBT5FgSHGb1p2rtx3BqoRyC+KqVKo8reHmpDpoKvwBmYYKpkmwX9Ra2xxeUYGLrb2ybLB8DYx6TbqtYvtHSRjfDO652liD+rV4xFH1onTGdwBEBKgOpjZ0hheYdmw0g/Sz5t99kRCL9onQzwZnnJHNJKmDY+gEjqA7C'
                ,'base64'
              ]
            }
          }
        })
        
        let addressLookupTable = await connection.getAddressLookupTable(new PublicKey('EYGgx5fYCZtLN2pvnR4Bhn5KpMffKwyHCms4VhjSvF2K')).then((res) => res.value)

        expect(addressLookupTable.key.toString()).toEqual('EYGgx5fYCZtLN2pvnR4Bhn5KpMffKwyHCms4VhjSvF2K')
        expect(addressLookupTable.state.addresses.length).toEqual(8)
      })

      it('mocks a complex transaction with instructions (like token transfers)', async ()=> {

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              api: struct([
                u8('instruction'),
                u64('amount')
              ])
            }]
          }
        })

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = [
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        ]
        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        let signedTransaction = await window.solana.signAndSendTransaction(transactionV0)

        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a complex transaction with multiple instructions (like a raydium swap)', async ()=> {

        let from = '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from,
            instructions:[
              {
                to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                api: struct([u8("instruction"), u64("amountIn"), u64("amountOut")]),
                params: {
                  instruction: 11,
                  amountIn: '100',
                  amountOut: '100',
                }
              },{
                to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                api: struct([u8("instruction"), u64("amountIn"), u64("amountOut")]),
                params: {
                  instruction: 9,
                  amountIn: '100',
                  amountOut: '100',
                }
              }
            ]
          }
        })

        let LAYOUT, data

        LAYOUT = struct([u8("instruction"), u64("maxAmountIn"), u64("amountOut")])
        data = Buffer.alloc(LAYOUT.span)
        LAYOUT.encode(
          {
            instruction: 11,
            maxAmountIn: new BN('100'),
            amountOut: new BN('100'),
          },
          data,
        )
        const instructions = []
        instructions.push(new TransactionInstruction({
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
            data,
            keys: [],
          })
        )

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')

        LAYOUT = struct([u8("instruction"), u64("amountIn"), u64("minAmountOut")])
        data = Buffer.alloc(LAYOUT.span)
        LAYOUT.encode(
          {
            instruction: 9,
            amountIn: new BN('100'),
            minAmountOut: new BN('100'),
          },
          data,
        )
        instructions.push(
          new TransactionInstruction({
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
            data,
            keys: [],
          })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        let signedTransaction = await window.solana.signAndSendTransaction(transactionV0)
        
        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('requires you to mock contract call transactions', async ()=> {
        
        mock(blockchain)

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = []
        instructions.push(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        await expect(
          window.solana.signAndSendTransaction(transactionV0)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA\",\"api\":[\"API HERE\"],\"params\":{\"value\":\"HERE\"}}]}}"
        )
      })

      it('raises an error if a complex mock does not provide the api in the mock configuration', async ()=> {
        
        await expect(()=>{
          mock({
            blockchain,
            transaction: {
              from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
              instructions:[{
                to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
              }]
            }
          })
        }).toThrowError(`Web3Mock: Please provide the api for the transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA\",\"api\":\"PLACE API HERE\"}]}}`)
      })

      it('does not call the mock if `from` of the transaction mock is not matching', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa",
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
        
        await expect(
          window.solana.signAndSendTransaction(transactionV0)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"params\":{\"value\":\"HERE\"}}]}}"
        )
      })

      it('does not call the mock if `to` of the transaction instruction mock is not matching', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'NOTTokenProgram',
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
        
        await expect(
          window.solana.signAndSendTransaction(transactionV0)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"params\":{\"value\":\"HERE\"}}]}}"
        )
      })

      it('does not call the mock if params of the transaction instruction mock is are not matching', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: '11111111111111111111111111111111',
              api: struct([
                u32('instruction'),
                u64('lamports')
              ]),
              params: {
                instruction: 2,
                lamports: 2000000000,
              }
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
        
        await expect(
          window.solana.signAndSendTransaction(transactionV0)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"params\":{\"value\":\"HERE\"}}]}}"
        )
      })

      it('mocks a complex contract call transaction by fully mocking params with anything', async ()=> {

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              api: struct([
                u8('instruction'),
                u64('amount')
              ]),
              params: anything
            }]
          }
        })

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = []
        instructions.push(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        let signedTransaction = await window.solana.signAndSendTransaction(transactionV0)

        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('does not mock a complex contract call transaction by if keys do not match', async ()=> {

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              api: struct([
                u8('instruction'),
                u64('amount')
              ]),
              params: anything,
              keys: [
                { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
                { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
                { pubkey: fromPubkey, isSigner: true, isWritable: false }
              ]
            }]
          }
        })

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = []
        instructions.push(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        await expect(
          window.solana.signAndSendTransaction(transactionV0)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA\",\"api\":[\"API HERE\"],\"params\":{\"value\":\"HERE\"}}]}}"
        )
      })

      it('mocks a complex contract call transaction by partialy mocking params array value with anything', async ()=> {

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              api: struct([
                u8('instruction'),
                u64('amount')
              ]),
              params: {
                instruction: 3,
                amount: anything
              }
            }]
          }
        })

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = []

        instructions.push(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        let signedTransaction = await window.solana.signAndSendTransaction(transactionV0)
        
        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('fails the transaction if you mock an Error', async ()=>{

       let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              api: struct([
                u8('instruction'),
                u64('amount')
              ])
            }],
            return: Error('Some issue')
          }
        })

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = []

        instructions.push(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        await expect(
          window.solana.signAndSendTransaction(transactionV0)
        ).rejects.toEqual(new Error('Some issue'))

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks transaction instructions without data', async ()=>{

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
              api: struct([])
            }]
          }
        })

        const instructions = []

        instructions.push(await Token.solana.createAssociatedTokenAccountInstruction({
          token: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
          owner: fromPubkey,
          payer: fromPubkey,
        }))

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        await window.solana.signAndSendTransaction(transactionV0)
        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('allows to delay the transaction', async ()=>{

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              api: struct([
                u8('instruction'),
                u64('amount')
              ])
            }],
            delay: 1100
          }
        })

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = []

        instructions.push(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        let now = new Date().getTime()
        await window.solana.signAndSendTransaction(transactionV0)
        expect((new Date().getTime() - now) > 1000).toEqual(true)
        
        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('also mocks transaction getSignatureStatus for transactions', async ()=> {

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              api: struct([
                u8('instruction'),
                u64('amount')
              ]),
              params: {
                instruction: 3,
                amount: anything
              }
            }]
          }
        })

        let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

        let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
        let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

        const keys = [
          { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
          { pubkey: fromPubkey, isSigner: true, isWritable: false }
        ]

        let TRANSFER_LAYOUT = struct([
          u8('instruction'),
          u64('amount')
        ])
        const amount = 1000000000
        const data = Buffer.alloc(TRANSFER_LAYOUT.span)
        TRANSFER_LAYOUT.encode({
          instruction: 3, // TRANSFER
          amount: new BN(amount)
        }, data)
        
        const instructions = []

        instructions.push(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          instructions,
        }).compileToV0Message()
        const transactionV0 = new VersionedTransaction(messageV0)
        
        let signedTransaction = await window.solana.signAndSendTransaction(transactionV0)

        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)
        expect(mockedTransaction).toHaveBeenCalled()
        
        let status = await window.solana.getSignatureStatus(mockedTransaction.transaction._id)
        expect(status.value).toEqual(null)

        confirm(mockedTransaction)
        status = await window.solana.getSignatureStatus(mockedTransaction.transaction._id)
        expect(status.value).not.toEqual(null)
        expect(status.value.confirmationStatus).toEqual('confirmed')
        expect(status.value.confirmations).toEqual(0)

      })
    })
  })
});
