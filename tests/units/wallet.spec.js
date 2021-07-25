import { mock, resetMocks } from '../../src'

describe('mock MetaMask wallet specifics', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('raises an error if given wallet name is not known', async ()=>{
    expect(()=>{
      mock({ blockchain: 'ethereum', wallet: 'notawallet' })
    }).toThrowError('Web3Mock: Unknown wallet!')
  })
})
