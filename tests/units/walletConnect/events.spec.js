import WalletConnect from "@walletconnect/client"
import { Blockchain } from "@depay/web3-blockchains"
import { mock, resetMocks, trigger } from 'src'

describe('mocks walletConnect connect', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      let connector
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))
      beforeEach(()=>{ connector = {} })

      it('allows to mock event triggers for wallet connect', async ()=>{
        mock({ blockchain, connector, wallet: 'walletconnect' })

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

      it('allows to deregister events for walletconnect', async ()=>{
        mock({ blockchain, connector, wallet: 'walletconnect' })

        let connectCalledWith
        const onConnecctCallback = (error, payload) => {
          connectCalledWith = payload
        }
        connector.on("connect", onConnecctCallback)
        connector.off("connect", onConnecctCallback)

        trigger('connect', [undefined, 'connected'])

        expect(connectCalledWith).toEqual(undefined)
      })
    })
  })
});
