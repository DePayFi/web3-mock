import { Connection, PublicKey, struct, publicKey, u64, u32, u8, bool } from '@depay/solana-web3.js'
import { mock, resetMocks, anything } from 'src'
import { supported } from "src/blockchains"

describe('mocks solana requests', ()=> {

  let rejectsWithMatch = async (method, match)=> {
    let raisedError
    try {
      await method()
    } catch (error) { raisedError = error }
    expect(raisedError.message).toMatch(match)
  }

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      let api = struct([
        publicKey('mint'),
        publicKey('owner'),
        u64('amount'),
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
              amount: '2511210038936013080',
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
        expect(decoded.amount.toString()).toEqual('2511210038936013080')
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

      it('throws an error if the api for the request was not provided', ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        expect(()=>{
          mock({
            provider: connection,
            blockchain,
            request: {
              method: 'getAccountInfo',
              to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
              return: {}
            }
          })
        }).toThrowError(`Web3Mock: Please provide the api for the request: {\"provider\":\"PROVIDER\",\"blockchain\":\"${blockchain}\",\"request\":{\"method\":\"getAccountInfo\",\"to\":\"2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9\",\"return\":{},\"api\":[\"PLACE API HERE\"]}}`)
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
    })
  })
});
