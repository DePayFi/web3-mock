import WalletConnect from "@walletconnect/client"
import { Blockchain } from "@depay/web3-blockchains"
import { mock, resetMocks, trigger } from 'src'
import { supported } from "src/blockchains"

describe('mocks walletConnect connect', ()=> {

  supported.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletConnectStub {}

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))

      it('fails if you try to mock WalletConnect without passing a connector instance', async ()=>{
        await expect(()=>{
          mock({ blockchain, wallet: 'walletconnect' })
        }).toThrowError('You need to pass a WalletConnect connector instance when mocking WalletConnect!')
      })

      it('mocks the WalletConnect client constructor, createSession and connect', async ()=>{
        mock({ blockchain, connector: WalletConnectStub, wallet: 'walletconnect' })
        
        await WalletConnectStub.instance.createSession()
        let { accounts, chainId } = await WalletConnectStub.instance.connect()

        expect(accounts).toEqual(mockedAccounts)
        expect(chainId).toEqual(Blockchain.findByName(blockchain).networkId)
      })
    })
  })
});
