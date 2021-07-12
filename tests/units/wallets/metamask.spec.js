import { mock, resetMocks } from '../../../src'

describe('mock MetaMask wallet specifics', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks MetaMask identifier', async ()=>{
    mock({ blockchain: 'ethereum', wallet: 'metamask' })
    expect(global.ethereum.isMetaMask).toEqual(true)
  })

  it('resets in between tests thanks to resetMocks', async ()=>{
    expect(typeof global.ethereum.isMetaMask).toEqual('undefined')
  })

  it('raises an error if given wallet name is not known', async ()=>{
    expect(()=>{
      mock({ blockchain: 'ethereum', wallet: 'notawallet' })
    }).toThrowError('Web3Mock: Unknown wallet!')
  })
})
