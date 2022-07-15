import { ethers } from 'ethers'
import { mock, resetMocks, confirm, increaseBlock } from 'src'
import { supported } from "src/blockchains"

describe('mock evm transaction confirmations', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']

      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('allows to control confirmation amount explicitly', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: '1000000000000000000'
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        let waitedFor1Confirmation;
        let sentTransaction;
        let transactionReceipt;

        await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("1")
        }).then(async function(transaction){
          sentTransaction = transaction
        })

        confirm(mockedTransaction)

        await sentTransaction.wait(1).then(function(receipt){
          transactionReceipt = receipt
          waitedFor1Confirmation = true
        })

        expect(waitedFor1Confirmation).toEqual(true)
        expect(sentTransaction.hash).toBeDefined()
        expect(transactionReceipt.transactionHash).toBeDefined()
        expect(sentTransaction.hash).toEqual(transactionReceipt.transactionHash)

        increaseBlock(12)

        let waitedFor12Confirmations;
        await sentTransaction.wait(12).then(function(receipt){
          transactionReceipt = receipt
          waitedFor12Confirmations = true
        })

        expect(transactionReceipt.transactionHash).toBeDefined()
        expect(waitedFor12Confirmations).toEqual(true)
      })

      it('implicitly increase block by one when calling confirm', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: '1000000000000000000'
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        let waitedFor1Confirmation;
        let sentTransaction;
        let transactionReceipt;

        await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("1")
        }).then(async function(transaction){
          sentTransaction = transaction
        })

        let blockBefore = await provider.getBlockNumber()    
        confirm(mockedTransaction)
        expect(await provider.getBlockNumber()).toEqual(blockBefore+1)
      })

    })
  })
})
