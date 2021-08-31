import { ethers } from 'ethers'
import { mock, resetMocks, mockJsonRpcProvider } from 'src'

describe('mock for multiple providers across multiple chains', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks balances for multiple chains for multiple providers', async ()=>{

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
    mock('ethereum')

    mockJsonRpcProvider({ blockchain: 'bsc', window: global })
    provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org');
    balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceBsc.toString())
    expect(balanceBscMock).toHaveBeenCalled()
    
    provider = new ethers.providers.Web3Provider(global.ethereum);
    balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceEthereum.toString())
    expect(balanceEthereumMock).toHaveBeenCalled()
  })
})
