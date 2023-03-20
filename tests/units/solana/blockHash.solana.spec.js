import { mock, resetMocks, anything } from 'dist/esm/index.solana'
import { Connection, PublicKey } from '@depay/solana-web3.js'
import { supported } from "src/blockchains"

describe('mocks solana block hash', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)
      afterEach(resetMocks)
      beforeEach(()=>mock({ blockchain }))

      it('mocks the block height request', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        mock({ blockchain, provider: connection })

        let blockHash = await connection.getLatestBlockhash()

        expect(blockHash.blockhash).toBeDefined()
        expect(blockHash.lastValidBlockHeight).toEqual(1)
      })
    })
  })
});
