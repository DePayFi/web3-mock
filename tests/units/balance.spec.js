import { ethers } from 'ethers'
import { mock, resetMocks, anything } from 'src'

describe('mock multiple balances', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks balances for multiple chains', async ()=>{

    let balance
    let provider

    let balanceEthereum = ethers.utils.parseUnits('100', 18)
    let balanceEthereumMock = mock({
      blockchain: 'ethereum',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: balanceEthereum
      }
    })

    let balanceBsc = ethers.utils.parseUnits('1337', 18)
    let balanceBscMock = mock({
      blockchain: 'bsc',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: balanceBsc
      }
    })

    mock('bsc')
    provider = new ethers.providers.Web3Provider(global.ethereum);
    balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceBsc.toString())
    expect(balanceBscMock).toHaveBeenCalled()
    
    mock('ethereum')
    provider = new ethers.providers.Web3Provider(global.ethereum);
    balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
    expect(balance.toString()).toEqual(balanceEthereum.toString())
    expect(balanceEthereumMock).toHaveBeenCalled()
  })
})
