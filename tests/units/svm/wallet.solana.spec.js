import { mock, resetMocks } from 'dist/esm/index.svm'
import { supported } from "src/blockchains"

describe('solana mock wallet specifics', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      it('mocks Phantom identifier', async ()=>{
        mock({ blockchain, wallet: 'phantom' })
        expect(global.solana.isPhantom).toEqual(true)
      })
    })
  })
})
