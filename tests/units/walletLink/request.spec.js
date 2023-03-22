import { mock, resetMocks } from 'src'
import Blockchains from '@depay/web3-blockchains'
import { supported } from "src/blockchains"

describe('mocks walletConnect requests', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletLinkStub {}

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))
      beforeEach(()=>{ 
        mock({ blockchain, connector: WalletLinkStub, wallet: 'walletlink' })
      })

      it('mocks requests through walletlink', async ()=>{
        expect(await WalletLinkStub.instance.request({ method: 'eth_chainId' })).toEqual(
          Blockchains.findByName(blockchain).id
        )
      })
    })
  })
});
