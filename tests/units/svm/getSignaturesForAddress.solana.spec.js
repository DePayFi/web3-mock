import { mock, resetMocks, anything } from 'dist/esm/index.svm'
import { Connection, PublicKey } from '@depay/solana-web3.js';
import { supported } from "src/blockchains"

describe('mocks getSignaturesForAddress', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)
      afterEach(resetMocks)
      beforeEach(()=>mock({ blockchain }))

      it('mocks getSignaturesForAddress', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        mock({
          blockchain,
          provider: connection,
          request: {
            method: 'getSignaturesForAddress',
            params: ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'],
            return: [
              {
                "blockTime": 1684586373,
                "confirmationStatus": "finalized",
                "err": null,
                "memo": null,
                "signature": "3gQPjZfeZZ7MvWdCtJudSfLJF7UzXn1ffwNVapd2f464KgZ76DU5NRzf6RUEHv8LGkvSEWgrQehNX5cn1BQ4GqSp",
                "slot": 194962028
              }
            ]
          }
        })

        let signatures = await connection.getSignaturesForAddress(new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'))

        expect(signatures[0].blockTime).toEqual(1684586373)
        expect(signatures[0].confirmationStatus).toEqual('finalized')
        expect(signatures[0].err).toEqual(null)
        expect(signatures[0].memo).toEqual(null)
        expect(signatures[0].signature).toEqual('3gQPjZfeZZ7MvWdCtJudSfLJF7UzXn1ffwNVapd2f464KgZ76DU5NRzf6RUEHv8LGkvSEWgrQehNX5cn1BQ4GqSp')
        expect(signatures[0].slot).toEqual(194962028)

      })
    })
  })
});
