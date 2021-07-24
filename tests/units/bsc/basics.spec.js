import { ethers } from 'ethers'
import { mock } from '../../../src'

describe('mock ethereum basics', ()=> {

  let window;

  beforeEach(()=>{
    mock('ethereum')
  })

  it('fails if requested method is not implemented', ()=>{
    expect(()=>{
      global.ethereum.request({ method: 'nonexisting' })
    }).toThrowError('Web3Mock Ethereum request: Unknown request method nonexisting!')
  })
  
  it('mocks default request for eth_chainId', async ()=> {

    let chainId = await global.ethereum.request({ method: 'eth_chainId' })
    expect(chainId).toEqual('0x1');

  });

  it('mocks default request for net_version', async ()=>{

    let networkVersion = await global.ethereum.request({ method: 'net_version' })
    expect(networkVersion).toEqual(1);

  })

  it('mocks default request for eth_requestAccounts', async ()=>{

    let accounts = await global.ethereum.request({ method: 'eth_requestAccounts' })
    expect(accounts).toEqual(['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']);

  })

  it('mocks default request for eth_accounts', async ()=>{

    let accounts = await global.ethereum.request({ method: 'eth_accounts' })
    expect(accounts).toEqual(['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']);

  })

  it('mocks default request for eth_estimateGas', async ()=>{

    let gas = await global.ethereum.request({ method: 'eth_estimateGas' })
    expect(gas).toEqual('0x2c4a0');

  })
  
  it('mocks default request for eth_blockNumber', async ()=>{

    let block = await global.ethereum.request({ method: 'eth_blockNumber' })
    expect(block).toEqual('0x01');

  })
});
