import { mock, resetMocks } from '../../src'

describe('resetMocks', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('initalizes the first mock', async ()=>{
    mock('ethereum')
  })

  it('makes sure that everything gets reset between tests', async ()=>{
    expect(global.ethereum).toEqual(undefined)
  })
})
