import { mock, resetMocks } from 'src'

describe('resetMocks', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)
      afterEach(resetMocks)

      it('initalizes the first mock', async ()=>{
        mock(blockchain)
      })

      it('makes sure that everything gets reset between tests', async ()=>{
        expect(global.ethereum).toEqual(undefined)
      })
    })
  })
})
