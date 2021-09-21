import WalletConnect from "@walletconnect/client"
import { Blockchain } from "depay-web3-blockchains"
import { mock, resetMocks, trigger } from 'src'

describe('mocks walletConnect connect', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      let connector
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))
      beforeEach(()=>{ connector = {} })

      it('fails if you try to mock WalletConnect without passing a connector instance', async ()=>{
        await expect(()=>{
          mock({ blockchain, wallet: 'walletconnect' })
        }).toThrowError('You need to pass a WalletConnect connector instance when mocking WalletConnect!')
      })

      it('mocks the WalletConnect client constructor, createSession and connect', async ()=>{
        mock({ blockchain, connector, wallet: 'walletconnect' })
        
        await connector.createSession()
        let { accounts, chainId } = await connector.connect()

        expect(accounts).toEqual(mockedAccounts)
        expect(chainId).toEqual(Blockchain.findByName(blockchain).networkId)
      })

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
    })
  })
});
