import { Connection, PublicKey, struct, publicKey, i128, u64, u32, u8, bool, str, Buffer } from '@depay/solana-web3.js'
import { mock, resetMocks, anything } from 'dist/esm/index.svm'
import { supported } from "src/blockchains"

describe('mocks solana requests', ()=> {

  let rejectsWithMatch = async (method, match)=> {
    let raisedError
    try {
      await method()
    } catch (error) { raisedError = error }
    expect(raisedError.message).toMatch(match)
  }

  supported.svm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      let api = struct([
        publicKey('mint'),
        publicKey('owner'),
        i128('amount'),
        u32('delegateOption'),
        publicKey('delegate'),
        u8('state'),
        u32('isNativeOption'),
        u64('isNative'),
        u64('delegatedAmount'),
        u32('closeAuthorityOption'),
        publicKey('closeAuthority'),
        bool('freezeAuthorityOption'),
      ])
      
      beforeEach(resetMocks)

      it('mocks a simple request', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getAccountInfo',
            to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            api,
            return: {
              mint: '8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r',
              owner: 'Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX',
              amount: '-2511210038936013080',
              delegateOption: 70962703,
              delegate: 'BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR',
              state: 0,
              isNativeOption: 0,
              isNative: '0',
              delegatedAmount: '0',
              closeAuthorityOption: 0,
              closeAuthority: '11111111111111111111111111111111',
              freezeAuthorityOption: true
            }
          }
        })

        let info = await connection.getAccountInfo(new PublicKey('2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'))

        expect(requestMock).toHaveBeenCalled()

        const decoded = api.decode(info.data)
        expect(decoded.mint.toString()).toEqual('8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r')
        expect(decoded.owner.toString()).toEqual('Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX')
        expect(decoded.amount.toString()).toEqual('-2511210038936013080')
        expect(decoded.delegateOption).toEqual(70962703)
        expect(decoded.delegate.toString()).toEqual('BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR')
        expect(decoded.state).toEqual(0)
        expect(decoded.isNativeOption).toEqual(0)
        expect(decoded.isNative.toString()).toEqual('0')
        expect(decoded.delegatedAmount.toString()).toEqual('0')
        expect(decoded.closeAuthorityOption).toEqual(0)
        expect(decoded.closeAuthority.toString()).toEqual('11111111111111111111111111111111')
        expect(decoded.freezeAuthorityOption).toEqual(true)
      })

      it('mocks strings in response data', async ()=>{

        let api = struct([
          publicKey('mint'),
          str('name'),
          str('symbol'),
        ])

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getAccountInfo',
            to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            api,
            return: {
              mint: '8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r',
              name: 'USD Coin',
              symbol: 'USDC',
            }
          }
        })

        let info = await connection.getAccountInfo(new PublicKey('2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'))

        expect(requestMock).toHaveBeenCalled()

        const decoded = api.decode(info.data)
        expect(decoded.mint.toString()).toEqual('8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r')
        expect(decoded.name).toEqual('USD Coin')
        expect(decoded.symbol).toEqual('USDC')
      })

      it('returns null if null was mocked', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getAccountInfo',
            to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            api,
            return: null
          }
        })

        let info = await connection.getAccountInfo(new PublicKey('2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'))

        expect(requestMock).toHaveBeenCalled()
        expect(info).toEqual(null)
      })

      it('throws an error if the contract was not mocked at all', async ()=>{
        
        let connection = new Connection('https://api.mainnet-beta.solana.com')
        
        mock({ blockchain, provider: connection })

        await rejectsWithMatch(
          async ()=>{ await connection.getAccountInfo(new PublicKey('2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9')) },
          'Web3Mock: Please mock the request to: 2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'
        )
      })

      it('asks you to mock if other mocks exist', async ()=> {
        
        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getAccountInfo',
            to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            api,
            return: {
              mint: '8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r',
              owner: 'Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX',
              amount: '2511210038936013080',
              delegateOption: 70962703,
              delegate: 'BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR',
              state: 0,
              isNativeOption: 0,
              isNative: '0',
              delegatedAmount: '0',
              closeAuthorityOption: 0,
              closeAuthority: '11111111111111111111111111111111'
            }
          }
        })

        await rejectsWithMatch(
          async ()=>{ await connection.getAccountInfo(new PublicKey('Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX')) },
          'Web3Mock: Please mock the request to: Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX'
        )
      })

      it('does NOT throw an error if the api for the request was not provided (as solana requests can have no apis)', ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        expect(()=>{
          mock({
            provider: connection,
            blockchain,
            request: {
              method: 'getProgramAccounts',
              to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
              return: {}
            }
          })
        }).not.toThrowError(`Web3Mock: Please provide the api for the request: {\"provider\":\"PROVIDER\",\"blockchain\":\"${blockchain}\",\"request\":{\"method\":\"getAccountInfo\",\"to\":\"2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9\",\"return\":{},\"api\":[\"PLACE API HERE\"]}}`)
      })

      it('throws an error if the contract was mocked to raise an error', async ()=>{
        
        let connection = new Connection('https://api.mainnet-beta.solana.com')
        
        mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getAccountInfo',
            to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            api,
            return: Error('SOMETHING WENT WRONG')
          }
        })

        await rejectsWithMatch(
          async ()=>{ await connection.getAccountInfo(new PublicKey('2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9')) },
          'SOMETHING WENT WRONG'
        )
      })

      it('mocks a getProgramAccounts request with params', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let wallet = '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'
        let mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

        let filters = [
          { dataSize: 165 },
          { memcmp: { offset: 32, bytes: wallet, encoding: "base58" }},
          { memcmp: { offset: 0, bytes: mint, encoding: "base58" }}
        ]

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getProgramAccounts',
            to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            params: { filters },
            return: [
              {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
              }
            ]
          }
        })

        let accounts = await connection.getProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), { filters })

        expect(requestMock).toHaveBeenCalled()

        expect(accounts.map((account)=>account.pubkey.toString())).toEqual([
          '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb',
          'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ',
          'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
        ])
      })

      it('fails if a request was mocked with other params', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let wallet = '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'
        let mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getProgramAccounts',
            to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            params: { 
              filters: [
                { dataSize: 165 },
                { memcmp: { offset: 32, bytes: wallet, encoding: "base58" }},
                { memcmp: { offset: 0, bytes: mint, encoding: "base58" }}
              ]
            },
            return: [
              {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
              }
            ]
          }
        })

        await expect(
          connection.getProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), { 
            filters: [
              { dataSize: 165 },
              { memcmp: { offset: 32, bytes: wallet, encoding: "base58" }},
            ]
          })
        ).rejects.toEqual("Web3Mock: Please mock the request: {\"blockchain\":\"solana\",\"request\":{\"to\":\"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA\",\"method\":\"getProgramAccounts\",\"return\":\"Your Value\",\"params\":{\"filters\":[{\"dataSize\":165},{\"memcmp\":{\"offset\":32,\"bytes\":\"2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9\",\"encoding\":\"base58\"}}]}}}")
      })

      it('mocks a getTokenAccountBalance request with params', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let tokenAccount = '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'

        let returnedBalance = {
          amount: "10000617",
          decimals: 6,
          uiAmount: 10.000617,
          uiAmountString: "10.000617"
        }

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getTokenAccountBalance',
            to: tokenAccount,
            return: returnedBalance
          }
        })

        let balance = await connection.getTokenAccountBalance(new PublicKey(tokenAccount))

        expect(requestMock).toHaveBeenCalled()

        expect(balance.value).toEqual(returnedBalance)
      })

      it('mocks a getMinimumBalanceForRentExemption request with params', async ()=>{
        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let rentMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getMinimumBalanceForRentExemption',
            params: [1],
            return: 2039280
          }
        })

        const rent = await connection.getMinimumBalanceForRentExemption(struct([u8('amount')]).span)

        expect(rentMock).toHaveBeenCalled()
        expect(rent).toEqual(2039280)
      })

      it('mocks a getMinimumBalanceForRentExemption independently from getProgramAccounts', async ()=>{
        let connection = new Connection('https://api.mainnet-beta.solana.com')
        
        let wallet = '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'
        let mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

        let filters = [
          { dataSize: 165 },
          { memcmp: { offset: 32, bytes: wallet, encoding: "base58" }},
          { memcmp: { offset: 0, bytes: mint, encoding: "base58" }}
        ]

        let requestMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getProgramAccounts',
            to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            params: { filters },
            return: [
              {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
              }
            ]
          }
        })

        let rentMock = mock({
          provider: connection,
          blockchain,
          request: {
            method: 'getMinimumBalanceForRentExemption',
            return: 2039280
          }
        })

        let accounts = await connection.getProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), { filters })

        expect(requestMock).toHaveBeenCalled()

        expect(accounts.map((account)=>account.pubkey.toString())).toEqual([
          '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb',
          'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ',
          'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
        ])
      })
    })
  })
});
