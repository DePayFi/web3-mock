import { mock, resetMocks } from 'dist/esm/index.evm'
import { supported } from "src/blockchains"

describe('evm mock wallet specifics (evm)', ()=> {

  supported.evm.forEach((blockchain)=>{

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
