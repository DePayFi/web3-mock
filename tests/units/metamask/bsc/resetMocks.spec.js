import { mock, resetMocks } from '../../../../src'

describe('resetMocks on bsc', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('initalizes the first mock', async ()=>{
    mock('bsc')
  })

  it('makes sure that everything gets reset between tests', async ()=>{
    expect(global.ethereum).toEqual(undefined)
  })
})
