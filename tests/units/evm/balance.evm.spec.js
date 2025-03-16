import { ethers } from 'ethers'
import { mock, resetMocks, anything } from 'dist/esm/index.evm'
import { supported } from "src/blockchains"

describe('mocks evm wallet balances (evm)', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      afterEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('mocks a balance', async ()=>{

        let balanceMock = mock({
          blockchain,
          balance: {
            for: '0xb0252f13850a4823706607524de0b146820F2240',
            return: '232111122321'
          }
        })

        let provider = new ethers.BrowserProvider(global.ethereum);
        let balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')

        expect(balance.toString()).toEqual('232111122321')
        expect(balanceMock).toHaveBeenCalled()
      })

       it('mocks a balance for a signer too', async ()=>{

        let balanceMock = mock({
          blockchain,
          balance: {
            for: accounts[0],
            return: '232111122321'
          }
        })

        let provider = new ethers.BrowserProvider(global.ethereum);
        let signer = provider.getSigner();
        let balance = await signer.getBalance()

        expect(balance.toString()).toEqual('232111122321')
        expect(balanceMock).toHaveBeenCalled()
      })

      it('suggests how to mock a balance', async ()=>{

        mock('ethereum')

        let provider = new ethers.BrowserProvider(global.ethereum);

        await expect(
          provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
        ).rejects.toEqual(
          "Web3Mock: Please mock the balance request: {\"blockchain\":\"ethereum\",\"balance\":{\"for\":\"0xb0252f13850a4823706607524de0b146820f2240\",\"return\":\"PUT BALANCE AMOUNT HERE\"}}"
        )
      })

      it('fails if balance mock does not match balance request', async ()=>{

        let balanceMock = mock({
          blockchain,
          balance: {
            for: '0xb0z52f13850a4823706607524de0b146820F2240',
            return: '232111122321'
          }
        })

        let provider = new ethers.BrowserProvider(global.ethereum);

        await expect(
          provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
        ).rejects.toEqual(
          `Web3Mock: Please mock the balance request: {\"blockchain\":\"${blockchain}\",\"balance\":{\"for\":\"0xb0252f13850a4823706607524de0b146820f2240\",\"return\":\"PUT BALANCE AMOUNT HERE\"}}`
        )
      })

      it('fails the balance if you mock an Error', async ()=> {
        
        let balanceMock = mock({
          blockchain,
          balance: {
            for: '0xb0252f13850a4823706607524de0b146820F2240',
            return: Error('Some issue')
          }
        })

        let provider = new ethers.BrowserProvider(global.ethereum);

        await expect(
          provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
        ).rejects.toEqual(new Error('Some issue'))

        expect(balanceMock).toHaveBeenCalled()
      })
    })
  })
});
