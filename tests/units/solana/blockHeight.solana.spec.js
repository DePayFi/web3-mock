import { mock, resetMocks, anything } from 'dist/esm/index.solana'
import { Connection, PublicKey } from '@depay/solana-web3.js';
import { supported } from "src/blockchains"

describe('mocks solana block height', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)
      afterEach(resetMocks)
      beforeEach(()=>mock({ blockchain }))

      it('mocks the block height request', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let balanceMock = mock({
          provider: connection,
          blockchain
        })

        let blockHeight = await connection.getBlockHeight()

        expect(blockHeight).toEqual(1)
      })
    })
  })
});
