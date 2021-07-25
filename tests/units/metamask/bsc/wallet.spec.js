import { mock, resetMocks } from '../../../../src'

describe('mocks MetaMask wallet specifics for bsc', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks MetaMask identifier', async ()=>{
    mock({ blockchain: 'bsc', wallet: 'metamask' })
    expect(global.ethereum.isMetaMask).toEqual(true)
  })
})
