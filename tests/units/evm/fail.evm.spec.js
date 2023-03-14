import { ethers } from 'ethers'
import { mock, resetMocks, fail } from 'dist/esm/index.evm'
import { supported } from "src/blockchains"

describe('mock evm transaction failures/reverts', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('allows to fail a transaction', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: '1000000000000000000'
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        let sentTransaction;
        let failedTransaction;

        await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("1")
        }).then(async function(transaction){
          sentTransaction = transaction
        })

        fail(mockedTransaction)

        await sentTransaction.wait(1).catch((error)=>{
          failedTransaction = true      
        })

        expect(failedTransaction).toEqual(true)
      })

      it('increases transaction count for this address', async ()=> {
        
         let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: '1000000000000000000'
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        let sentTransaction;
        let failedTransaction;

        await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("1")
        }).then(async function(transaction){
          sentTransaction = transaction
        })

        fail(mockedTransaction)

        await sentTransaction.wait(1).catch((error)=>{
          failedTransaction = true      
        })

        expect(failedTransaction).toEqual(true)

        let transactionCount = await provider.getTransactionCount(accounts[0])
        expect(transactionCount).toEqual(1)
      })
    })
  })
})
