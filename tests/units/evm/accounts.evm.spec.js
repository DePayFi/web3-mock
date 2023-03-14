import { ethers } from 'ethers'
import { mock, resetMocks, anything } from 'dist/esm/index.evm'
import { supported } from "src/blockchains"

describe('mocks evm wallet accounts (evm)', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      it('fails suggesting to mock accounts if they havent', async ()=>{
        mock(blockchain)

        let provider = new ethers.providers.Web3Provider(global.ethereum)
        await expect(()=>
          provider.listAccounts()
        ).toThrow(
          `Web3Mock: Please mock accounts: {\"blockchain\":\"${blockchain}\",\"accounts\":{\"return\":[\"YOUR ACCOUNT HERE\"]}}`
        )
      })

      it('mocks accounts', async ()=>{
        let accountsMock = mock({ blockchain, accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } })
        let provider = new ethers.providers.Web3Provider(global.ethereum)
        let accounts = await provider.listAccounts()

        expect(accounts).toEqual(['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'])

        expect(accountsMock).toHaveBeenCalled()
      })

      it('mocks a delay when requesting accounts', async ()=>{

        let accountsMock = mock({ blockchain, accounts: { delay: 1100, return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } })
        let provider = new ethers.providers.Web3Provider(global.ethereum)

        let now = new Date().getTime()
        let accounts = await provider.listAccounts()
        expect(accounts).toEqual(['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'])
        expect((new Date().getTime() - now) > 1000).toEqual(true)
        expect(accountsMock).toHaveBeenCalled()
      })

      it('mocks an error in retrieving accounts', async ()=>{

        let accountsMock = mock({ blockchain, accounts: { return: Error('User rejected the request.') } })
        let provider = new ethers.providers.Web3Provider(global.ethereum)

        await expect(
          provider.listAccounts()
        ).rejects.toEqual(
          new Error('User rejected the request.')
        )
      })

    })
  })
});
