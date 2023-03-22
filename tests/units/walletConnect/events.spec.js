import WalletConnect from "@walletconnect/client"
import { mock, resetMocks, trigger } from 'src'
import { supported } from "src/blockchains"

describe('mocks walletConnect connect', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletConnectStub {}

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))

      it('allows to mock event triggers for wallet connect', async ()=>{
        mock({ blockchain, connector: WalletConnectStub, wallet: 'walletconnect' })

        let connectCalledWith
        WalletConnectStub.instance.on("connect", (error, payload) => {
          connectCalledWith = payload
        })

        let sessionUpdateCalledWith
        WalletConnectStub.instance.on("session_update", (error, payload) => {
          sessionUpdateCalledWith = payload
        })

        let disconnectCalledWith
        WalletConnectStub.instance.on("disconnect", (error, payload) => {
          disconnectCalledWith = payload
        })

        trigger('connect', [undefined, 'connected'])
        trigger('session_update', [undefined, 'updated'])
        trigger('disconnect', [undefined, 'disconnected'])

        expect(connectCalledWith).toEqual('connected')
        expect(sessionUpdateCalledWith).toEqual('updated')
        expect(disconnectCalledWith).toEqual('disconnected')
      })

      it('allows to deregister events for walletconnect', async ()=>{
        mock({ blockchain, connector: WalletConnectStub, wallet: 'walletconnect' })

        let connectCalledWith
        const onConnecctCallback = (error, payload) => {
          connectCalledWith = payload
        }
        WalletConnectStub.instance.on("connect", onConnecctCallback)
        WalletConnectStub.instance.off("connect", onConnecctCallback)

        trigger('connect', [undefined, 'connected'])

        expect(connectCalledWith).toEqual(undefined)
      })
    })
  })
});
