import { createPublicClient, custom } from 'viem'
import { mock, resetMocks, anything } from 'src'
import { supported } from "src/blockchains"

describe('mocks viem transport', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      it('mocks a viem public client', async ()=>{
        
        let balanceMock = mock({
          blockchain,
          balance: {
            for: '0xb0252f13850a4823706607524de0b146820F2240',
            return: '232111122321'
          }
        })

        const client = createPublicClient({
          chain: {},
          transport: custom(window.ethereum),
        })

        let balance = await client.getBalance({ address: '0xb0252f13850a4823706607524de0b146820F2240' })

        expect(balance.toString()).toEqual('232111122321')
      })
    })
  })
})
