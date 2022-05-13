import { mock, resetMocks } from 'src'
import { supported } from "src/blockchains"

describe('mocks wallet specifics', ()=> {

  supported.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      it('mocks MetaMask identifier', async ()=>{
        mock({ blockchain, wallet: 'metamask' })
        expect(global.ethereum.isMetaMask).toEqual(true)
      })

      it('mocks CoinbaseWallet identifier', async ()=>{
        mock({ blockchain, wallet: 'coinbase' })
        expect(global.ethereum.isCoinbaseWallet).toEqual(true)
        expect(global.ethereum.isWalletLink).toEqual(true)
      })
    })
  })
})
