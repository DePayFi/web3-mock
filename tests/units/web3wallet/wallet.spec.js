import { mock, resetMocks } from 'src'

describe('mocks wallet specifics', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

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
