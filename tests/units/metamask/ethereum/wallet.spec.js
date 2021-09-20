import { mock, resetMocks } from 'src'

describe('mocks wallet specifics for ethereum', ()=> {

  beforeEach(resetMocks)

  it('mocks MetaMask identifier', async ()=>{
    mock({ blockchain: 'ethereum', wallet: 'metamask' })
    expect(global.ethereum.isMetaMask).toEqual(true)
  })

  it('mocks CoinbaseWallet identifier', async ()=>{
    mock({ blockchain: 'ethereum', wallet: 'coinbase' })
    expect(global.ethereum.isCoinbaseWallet).toEqual(true)
  })
})
