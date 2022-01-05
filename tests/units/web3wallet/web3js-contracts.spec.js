import Contract from 'web3-eth-contract'
import Web3 from 'web3'
import { mock, confirm, resetMocks } from 'src'

describe('mock and trigger web3-js contract interactions', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('mocks web3-contracts and their callbacks', async ()=> {

        const api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        const contractAddress = '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92'

        const params = {
          path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          amounts: ["773002376389189", "1000000000000000000", "3623748721"]
        }

        const mockedTransaction = mock({
          blockchain,
          transaction: {
            from: accounts[0],
            to: contractAddress,
            api: api,
            method: 'route',
            params
          }
        })

        Contract.setProvider(new Web3(global.ethereum))

        const contract = new Contract(api, contractAddress)
        
        let sendingCalledWith, receiptCalledWith

        contract.methods.route(
          params.path,
          params.amounts,
          [],
          [],
          []
        ).send({ from: accounts[0] })
        .on('sending', function(call){
          sendingCalledWith = call
        })
        .once('receipt', function(receipt){
          receiptCalledWith = receipt
        })

        await new Promise((resolve) => setTimeout(resolve, 1000))
        confirm(mockedTransaction)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        expect(sendingCalledWith.method).toEqual('eth_sendTransaction')
        expect(sendingCalledWith.params).toEqual([{
          from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          data: '0xb7d29a3500000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0bed124a09ac2bd941b10349d8d224fe3c955eb00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000002bf0aa40e22450000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000d7fe0471000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          gasPrice: '0x12fee89674',
          gas: undefined,
          to: '0xae60ac8e69414c2dc362d0e6a03af643d1d85b92'
        }])

        expect(receiptCalledWith.transactionHash).toEqual(mockedTransaction.transaction._id)
      })
    })
  })
})
