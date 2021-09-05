import { mock, resetMocks } from 'src'

describe('mock MetaMask wallet specifics', ()=> {

  const blockchain = 'ethereum'
  beforeEach(resetMocks)
  beforeEach(()=>mock({ blockchain, accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } }))

  it('raises an error if given wallet name is not known', async ()=>{
    expect(()=>{
      mock({ blockchain, wallet: 'notawallet' })
    }).toThrowError('Web3Mock: Unknown wallet!')
  })
})
