import { Blockchain } from "@depay/web3-blockchains"
import { mock, resetMocks, trigger } from 'src'
import { supported } from "src/blockchains"

describe('mocks walletConnect connect', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletLinkStub {}

      const mockedAccounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: mockedAccounts } }))

      it('allows to mock event triggers for wallet connect', async ()=>{
        mock({ blockchain, connector: WalletLinkStub, wallet: 'walletlink' })

        let accounts = ['0xb0252f13850a4823706607524de0b146820F2240', '0xEcA533Ef096f191A35DE76aa4580FA3A722724bE'];
        let accountsChangedTo;

        WalletLinkStub.instance.on('accountsChanged', (accounts)=>{
          accountsChangedTo = accounts
        })

        trigger('accountsChanged', accounts)

        expect(accountsChangedTo).toEqual(accounts)
      })

      it('allows to deregister events for walletconnect', async ()=>{
        mock({ blockchain, connector: WalletLinkStub, wallet: 'walletlink' })

        let accounts = ['0xb0252f13850a4823706607524de0b146820F2240', '0xEcA533Ef096f191A35DE76aa4580FA3A722724bE'];
        let accountsChangedTo;

        let onAccountsChanged = (accounts)=>{
          accountsChangedTo = accounts
        }
        
        WalletLinkStub.instance.on('accountsChanged', onAccountsChanged)
        WalletLinkStub.instance.removeListener('accountsChanged', onAccountsChanged)

        trigger('accountsChanged', accounts)
        expect(accountsChangedTo).toEqual(undefined)
      })
    })
  })
});
