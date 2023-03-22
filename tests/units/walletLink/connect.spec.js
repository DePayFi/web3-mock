import Blockchains from '@depay/web3-blockchains'
import { mock, resetMocks, trigger } from 'src'
import { supported } from "src/blockchains"

describe('mocks walletLink connect', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletLinkStub {}

      const account = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
      beforeEach(resetMocks)

      it('fails if you try to mock WalletLink without passing a connector instance', async ()=>{
        await expect(()=>{
          mock({ blockchain, wallet: 'walletlink' })
        }).toThrowError('You need to pass a WalletLink connector instance when mocking WalletLink!')
      })

      it('mocks the WalletLink client constructor, and methods', async ()=>{
        mock({ blockchain, connector: WalletLinkStub, wallet: 'walletlink', accounts: { return: [account] } })
        
        let accounts = await WalletLinkStub.instance.enable()
        let chainId = await WalletLinkStub.instance.getChainId()
        let relay = await WalletLinkStub.instance._relayProvider()

        expect(accounts).toEqual([account])
        expect(chainId).toEqual(Blockchains.findByName(blockchain).networkId)
        expect(typeof relay.setConnectDisabled).toEqual('function')
      })
    })
  })
});
