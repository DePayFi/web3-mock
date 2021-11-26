import WalletConnect from '@walletconnect/client'
import { mock, resetMocks } from 'src'
import { Blockchain } from '@depay/web3-blockchains'

describe('mocks walletConnect requests', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      let connector
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))
      beforeEach(()=>{ 
        connector = {}
        mock({ blockchain, connector, wallet: 'walletconnect' })
      })

      it('mocks requests through walletconnect', async ()=>{
        expect(await connector.sendCustomRequest({ method: 'eth_chainId' })).toEqual(
          Blockchain.findByName(blockchain).id
        )
      })
    })
  })
});
