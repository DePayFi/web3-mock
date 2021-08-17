import { ethers } from 'ethers'
import { mock, resetMocks, anything } from 'src'

describe('mock multiple balances', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks a balance', async ()=>{

    let balanceMock = mock({
      blockchain: 'ethereum',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820F2240',
        return: '232111122321'
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum);
    let balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')

    expect(balance.toString()).toEqual('232111122321')
    expect(balanceMock).toHaveBeenCalled()
  })

})
