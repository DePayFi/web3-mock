import { mock, resetMocks, anything } from 'src'
import { supported } from "src/blockchains"

describe('mocks solana wallet accounts', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      it('fails suggesting to mock accounts if they havent', async ()=>{
        mock(blockchain)

        await expect(()=>
          global.solana.connect()
        ).toThrow(
          `Web3Mock: Please mock accounts: {\"blockchain\":\"${blockchain}\",\"accounts\":{\"return\":[\"YOUR ACCOUNT HERE\"]}}`
        )
      })

      it('mocks accounts', async ()=>{
        let accountsMock = mock({ blockchain, accounts: { return: ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'] } })
        let { publicKey } = await global.solana.connect()

        expect(publicKey.toString()).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')

        expect(accountsMock).toHaveBeenCalled()
      })

      it('mocks a delay when requesting accounts', async ()=>{

        let accountsMock = mock({ blockchain, accounts: { delay: 1100, return: ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'] } })

        let now = new Date().getTime()
        let { publicKey } = await global.solana.connect()

        expect(publicKey.toString()).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
        expect((new Date().getTime() - now) > 1000).toEqual(true)
        expect(accountsMock).toHaveBeenCalled()
      })

      it('mocks an error in retrieving accounts', async ()=>{

        let accountsMock = mock({ blockchain, accounts: { return: Error({ code: 4001, message: 'User rejected the request.' }) } })

        await expect(
          global.solana.connect()
        ).rejects.toEqual(
          new Error({ code: 4001, message: 'User rejected the request.' })
        )
      })

    })
  })
});
