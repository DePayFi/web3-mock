import { ethers } from 'ethers'
import { mock, resetMocks, confirm, anything } from 'src'

describe('mock transactions', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletLinkStub {}
      
      beforeEach(resetMocks)

      it('initializes connector class instance', async ()=> {
        mock({ blockchain, connector: WalletLinkStub, wallet: 'walletlink' })
        expect(WalletLinkStub.instance).toBeDefined()
      })

      it('resets initialized connect class instance between tests', async ()=> {
        expect(WalletLinkStub.instance).not.toBeDefined()
      })
    })
  })
})
