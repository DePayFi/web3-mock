import { ethers } from 'ethers'
import { mock, trigger } from '../../../src'

describe('mock ethereum events', ()=> {

  let window;
  let provider;

  beforeEach(()=>{
    window = { ethereum: {} };
  })

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

});
