import { Blockchain } from "@depay/web3-blockchains"
import { mock, resetMocks, trigger } from 'src'

describe('mocks walletLink connect', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletLinkStub {}

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))

      it('fails if you try to mock WalletLink without passing a connector instance', async ()=>{
        await expect(()=>{
          mock({ blockchain, wallet: 'walletlink' })
        }).toThrowError('You need to pass a WalletLink connector instance when mocking WalletLink!')
      })

      it('mocks the WalletLink client constructor, and methods', async ()=>{
        mock({ blockchain, connector: WalletLinkStub, wallet: 'walletlink' })
        
        let accounts = await WalletLinkStub.instance.enable()
        let chainId = await WalletLinkStub.instance.getChainId()
        let relay = await WalletLinkStub.instance._relayProvider()

        expect(accounts).toEqual(mockedAccounts)
        expect(chainId).toEqual(Blockchain.findByName(blockchain).networkId)
        expect(typeof relay.setConnectDisabled).toEqual('function')
      })
    })
  })
});
