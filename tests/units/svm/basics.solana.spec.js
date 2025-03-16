import { mock, resetMocks } from 'dist/esm/index.svm'
import { supported } from "src/blockchains"

describe('mocks solana basics', ()=> {

  supported.svm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      beforeEach(()=>{
        mock(blockchain)
      })

      it('fails if requested method is not implemented', ()=>{
        expect(()=>{
          global.solana.request({ method: 'nonexisting' })
        }).toThrowError('Web3Mock request: Unknown request method nonexisting!')
      })
    })
  })
});
