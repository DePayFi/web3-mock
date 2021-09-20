import { mock, resetMocks } from 'src'

describe('mocks wallet specifics for bsc', ()=> {

  beforeEach(resetMocks)

  it('mocks MetaMask identifier', async ()=>{
    mock({ blockchain: 'bsc', wallet: 'metamask' })
    expect(global.ethereum.isMetaMask).toEqual(true)
  })

  it('mocks CoinbaseWallet identifier', async ()=>{
    mock({ blockchain: 'bsc', wallet: 'coinbase' })
    expect(global.ethereum.isCoinbaseWallet).toEqual(true)
  })
})
