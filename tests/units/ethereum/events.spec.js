import { ethers } from 'ethers'
import { Web3Mock } from '../../../src'

describe('Web3Mock Ethereum events', ()=> {

  let window;
  let provider;

  beforeEach(()=>{
    window = { ethereum: {} };
  })

  it('allows to trigger events', async ()=> {
    
    Web3Mock({ mocks: 'ethereum', window })

    let accounts = ['0xb0252f13850a4823706607524de0b146820F2240', '0xEcA533Ef096f191A35DE76aa4580FA3A722724bE'];
    let accountsChangedTo;

    window.ethereum.on('accountsChanged', (accounts)=>{
      accountsChangedTo = accounts
    })

    Web3Mock.trigger('accountsChanged', accounts)

    expect(accountsChangedTo).toEqual(accounts)
  })

});
