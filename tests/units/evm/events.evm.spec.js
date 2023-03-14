import { ethers } from 'ethers'
import { mock, resetMocks, trigger } from 'dist/esm/index.evm'
import { supported } from "src/blockchains"

describe('mock evm events (evm)', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      it('allows to trigger events', async ()=> {
        
        mock('ethereum')

        let accounts = ['0xb0252f13850a4823706607524de0b146820F2240', '0xEcA533Ef096f191A35DE76aa4580FA3A722724bE'];
        let accountsChangedTo;

        global.ethereum.on('accountsChanged', (accounts)=>{
          accountsChangedTo = accounts
        })

        trigger('accountsChanged', accounts)

        expect(accountsChangedTo).toEqual(accounts)
      })

      it('allows to deregister events', async ()=> {
        
        mock('ethereum')

        let accounts = ['0xb0252f13850a4823706607524de0b146820F2240', '0xEcA533Ef096f191A35DE76aa4580FA3A722724bE'];
        let accountsChangedTo;

        const onAccountsChanged = (accounts)=>{
          accountsChangedTo = accounts
        }

        global.ethereum.on('accountsChanged', onAccountsChanged)
        global.ethereum.removeListener('accountsChanged', onAccountsChanged)

        trigger('accountsChanged', accounts)

        expect(accountsChangedTo).toEqual(undefined)
      })
    })
  })
});
