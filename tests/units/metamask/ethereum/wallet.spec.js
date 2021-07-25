import { mock, resetMocks } from '../../../../src'

describe('mocks MetaMask wallet specifics for ethereum', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks MetaMask identifier', async ()=>{
    mock({ blockchain: 'ethereum', wallet: 'metamask' })
    expect(global.ethereum.isMetaMask).toEqual(true)
  })
})
