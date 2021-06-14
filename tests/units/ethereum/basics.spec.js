import { ethers } from 'ethers'
import { Web3Mock } from '../../../src'

describe('Web3Mock Ethereum', ()=> {

  let window;

  beforeEach(()=>{
    window = {};
    
    Web3Mock({
      window: window,
      mocks: ['ethereum']
    })
  })

  it('fails if requested method is not implemented', ()=>{
    expect(()=>{
      window.ethereum.request({ method: 'nonexisting' })
    }).toThrow('Web3Mock Ethereum request: Unknown request method!')
  })
  
  it('mocks default request for eth_chainId', async ()=> {

    let chainId = await window.ethereum.request({ method: 'eth_chainId' })
    expect(chainId).toEqual('0x1');

  });

  it('mocks default request for eth_getBalance', async ()=> {

    let balance = await window.ethereum.request({ method: 'eth_getBalance' })
    expect(balance).toEqual(ethers.BigNumber.from('0'));

  });

  it('mocks default request for net_version', async ()=>{

    let networkVersion = await window.ethereum.request({ method: 'net_version' })
    expect(networkVersion).toEqual(1);

  })

  it('mocks default request for eth_requestAccounts', async ()=>{

    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    expect(accounts).toEqual([]);

  })

  it('mocks default request for eth_accounts', async ()=>{

    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    expect(accounts).toEqual([]);

  })

  it('mocks default request for eth_estimateGas', async ()=>{

    let gas = await window.ethereum.request({ method: 'eth_estimateGas' })
    expect(gas).toEqual('0x2c4a0');

  })
  
  it('mocks default request for eth_blockNumber', async ()=>{

    let block = await window.ethereum.request({ method: 'eth_blockNumber' })
    expect(block).toEqual('0x5daf3b');

  })
});
