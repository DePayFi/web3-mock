import { ethers } from 'ethers'
import { mock, resetMocks, connect, mockRpc } from 'src'

describe('mock for multiple providers across multiple chains', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('asks to mock RPC url to blockchain', async ()=>{
    mock('bsc')
    await expect(()=>
      new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org')
    ).toThrow(
      "Web3Mock: Unknown RPC! Add RPC mock with: mockRpc('https://bsc-dataseed.binance.org', '<blockchain>')"
    )
  })

  it('mocks requests for multiple chains for multiple providers', async ()=>{

    let balance
    let provider

    let balanceBsc = ethers.utils.parseUnits('1337', 18)
    let balanceBscMock = mock({
      blockchain: 'bsc',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: balanceBsc
      }
    })

    let balanceEthereum = ethers.utils.parseUnits('100', 18)
    let balanceEthereumMock = mock({
      blockchain: 'ethereum',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: balanceEthereum
      }
    })

    // connect network to ethereum
    connect('ethereum')

    mockRpc('https://bsc-dataseed.binance.org', 'bsc')

    provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org');
    balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceBsc.toString())
    expect(balanceBscMock).toHaveBeenCalled()
    
    provider = new ethers.providers.Web3Provider(global.ethereum);
    balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceEthereum.toString())
    expect(balanceEthereumMock).toHaveBeenCalled()

    provider = new ethers.providers.JsonRpcBatchProvider('https://bsc-dataseed.binance.org');
    let balance1 = provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    let balance2 = provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    let balance3 = provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    balance1 = await balance1
    balance2 = await balance2
    balance3 = await balance3
    expect(balance1.toString()).toEqual(balanceBsc.toString())
    expect(balance2.toString()).toEqual(balanceBsc.toString())
    expect(balance3.toString()).toEqual(balanceBsc.toString())
    expect(balanceBscMock).toHaveBeenCalledTimes(4)
  })
})
