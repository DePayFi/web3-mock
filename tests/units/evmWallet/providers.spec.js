import { ethers } from 'ethers'
import { mock, resetMocks, connect } from 'src'

describe('evm mock for multiple providers across multiple chains', ()=> {

  beforeEach(resetMocks)

  it('mocks requests for multiple chains for multiple providers', async ()=>{

    let balance

    let balanceEthereum = ethers.utils.parseUnits('100', 18)
    let balanceEthereumMock = mock({
      blockchain: 'ethereum',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: balanceEthereum
      }
    })
    
    let balanceBsc = ethers.utils.parseUnits('1337', 18)
    let bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org');
    let balanceBscMock = mock({
      provider: bscProvider,
      blockchain: 'bsc',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: balanceBsc
      }
    })

    connect('ethereum')
    balance = await bscProvider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceBsc.toString())
    expect(balanceBscMock).toHaveBeenCalled()
    
    let ethereumProvider = new ethers.providers.Web3Provider(global.ethereum);
    balance = await ethereumProvider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceEthereum.toString())
    expect(balanceEthereumMock).toHaveBeenCalled()

    let bscBatchProvider = new ethers.providers.JsonRpcBatchProvider('https://bsc-dataseed.binance.org');
    let balanceBscBatchMock = mock({
      provider: bscBatchProvider,
      blockchain: 'bsc',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: balanceBsc
      }
    })
    let balance1 = bscBatchProvider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    let balance2 = bscBatchProvider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    let balance3 = bscBatchProvider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    balance1 = await balance1
    balance2 = await balance2
    balance3 = await balance3
    expect(balance1.toString()).toEqual(balanceBsc.toString())
    expect(balance2.toString()).toEqual(balanceBsc.toString())
    expect(balance3.toString()).toEqual(balanceBsc.toString())
    expect(balanceBscBatchMock).toHaveBeenCalledTimes(3)
  })
})
