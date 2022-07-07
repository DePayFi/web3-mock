import { ethers } from 'ethers'
import { mock, resetMocks, confirm, anything } from 'src'
import { supported } from "src/blockchains"

describe('mock transactions', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletConnectStub {}
      
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))
      beforeEach(()=>{ 
        mock({ blockchain, connector: WalletConnectStub, wallet: 'walletconnect' })
      })

      it('does not mock transactions per default', async ()=> {
        
        await expect(
          WalletConnectStub.instance.sendTransaction({
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: ethers.utils.parseEther("1")
          })
        ).rejects.toEqual(
          "Web3Mock: Please mock the transaction to: 0x5Af489c8786A018EC4814194dC8048be1007e390"
        )
      })

      it('mocks a simple transaction', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
            from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            value: "2000000000000000000"
          }
        })

        let transaction = await WalletConnectStub.instance.sendTransaction({
          from: accounts[0],
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("2")
        })

        expect(transaction).toBeDefined()
        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a complex contract transaction', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: accounts[0],
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'route',
            params: {
              path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
              amounts: ["773002376389189", "1000000000000000000", "3623748721"]
            }
          }
        })

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api
        );

        let transaction = await contract.populateTransaction.route(
          ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          ["773002376389189", "1000000000000000000", "3623748721"],
          [],
          [],
          [],
          { value: 0 }
        )

        transaction.from = accounts[0]
        let submittedTransaction = await WalletConnectStub.instance.sendTransaction(transaction)

        expect(submittedTransaction).toBeDefined()
        expect(mockedTransaction).toHaveBeenCalled()
      })
    })
  })
})
