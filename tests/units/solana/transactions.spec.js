import { ethers } from 'ethers'
import { Transaction, SystemProgram, PublicKey, struct, u8, u32, u64, BN, TransactionInstruction } from '@depay/solana-web3.js'
import { mock, resetMocks, confirm, anything, replace } from 'src'
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
        
        await expect(
          window.solana.signAndSendTransaction(transaction)
        ).rejects.toEqual(
          'Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"data\":{\"value\":\"HERE\"}}]}}'
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

        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

        expect(mockedTransaction).toHaveBeenCalled()
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
        
        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )
        
        let signedTransaction = await window.solana.signAndSendTransaction(transaction)

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
        
        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )
        
        await expect(
          window.solana.signAndSendTransaction(transaction)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA\",\"api\":[\"API HERE\"],\"data\":{\"value\":\"HERE\"}}]}}"
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
        
        await expect(
          window.solana.signAndSendTransaction(transaction)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"data\":{\"value\":\"HERE\"}}]}}"
        )
      })

      it('does not call the mock if `to` of the transaction instruction mock is not matching', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            instructions:[{
              to: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
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
        
        await expect(
          window.solana.signAndSendTransaction(transaction)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"data\":{\"value\":\"HERE\"}}]}}"
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
                instruction: 3, // transfer
                amount: 2000000000
              }
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
        
        await expect(
          window.solana.signAndSendTransaction(transaction)
        ).rejects.toEqual(
          "Web3Mock: Please mock the following transaction: {\"blockchain\":\"solana\",\"transaction\":{\"from\":\"2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1\",\"instructions\":[{\"to\":\"11111111111111111111111111111111\",\"api\":[\"API HERE\"],\"data\":{\"value\":\"HERE\"}}]}}"
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
        
        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )
        
        let signedTransaction = await window.solana.signAndSendTransaction(transaction)

        expect(signedTransaction).toBeDefined()
        expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

        expect(mockedTransaction).toHaveBeenCalled()
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
        
        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )
        
        let signedTransaction = await window.solana.signAndSendTransaction(transaction)

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
        
        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )
        
        await expect(
          window.solana.signAndSendTransaction(transaction)
        ).rejects.toEqual(new Error('Some issue'))

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
            delay: 1000
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
        
        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )
        
        let now = new Date().getTime()
        await window.solana.signAndSendTransaction(transaction)
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
        
        let transaction = new Transaction({
          recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
          feePayer: fromPubkey
        })

        transaction.add(
          new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
        )
        
        let signedTransaction = await window.solana.signAndSendTransaction(transaction)

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
