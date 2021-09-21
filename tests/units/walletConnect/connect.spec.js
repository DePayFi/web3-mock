import WalletConnect from "@walletconnect/client"
import { Blockchain } from "depay-web3-blockchains"
import { mock, resetMocks, trigger } from 'src'

describe('mocks walletConnect connect', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))

      it('mocks the WalletConnect client constructor, createSession and connect', async ()=>{
        mock({ blockchain, wallet: 'walletconnect' })
        
        const connector = new WalletConnect({
          bridge: "https://bridge.walletconnect.org"
        })

        await connector.createSession()
        let { accounts, chainId } = await connector.connect()

        expect(accounts).toEqual(mockedAccounts)
        expect(chainId).toEqual(Blockchain.findByName(blockchain).networkId)
      })

      it('allows to mock event triggers for wallet connect', async ()=>{
        mock({ blockchain, wallet: 'walletconnect' })

        const connector = new WalletConnect({
          bridge: "https://bridge.walletconnect.org"
        })

        let connectCalledWith
        connector.on("connect", (error, payload) => {
          connectCalledWith = payload
        })

        let sessionUpdateCalledWith
        connector.on("session_update", (error, payload) => {
          sessionUpdateCalledWith = payload
        })

        let disconnectCalledWith
        connector.on("disconnect", (error, payload) => {
          disconnectCalledWith = payload
        })

        trigger('connect', [undefined, 'connected'])
        trigger('session_update', [undefined, 'updated'])
        trigger('disconnect', [undefined, 'disconnected'])

        expect(connectCalledWith).toEqual('connected')
        expect(sessionUpdateCalledWith).toEqual('updated')
        expect(disconnectCalledWith).toEqual('disconnected')
      })
    })
  })
});
