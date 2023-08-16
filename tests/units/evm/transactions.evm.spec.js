import Blockchains from "@depay/web3-blockchains"
import { ethers } from 'ethers'
import { mock, resetMocks, confirm, anything, replace } from 'dist/esm/index.evm'
import { supported } from "src/blockchains"

describe('mock transactions', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('does not mock transactions per default', async ()=> {
        
        mock(blockchain)

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        await expect(
          signer.sendTransaction({
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: ethers.utils.parseEther("1")
          })
        ).rejects.toEqual(
          "Web3Mock: Please mock the transaction to: 0x5af489c8786a018ec4814194dc8048be1007e390"
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

        expect(mockedTransaction.transaction._id).toBeDefined()

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        let transaction = await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("2")
        })

        expect(transaction).toBeDefined()
        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a transaction receipt', async ()=> {

        let logs = [{
          blockNumber: 16797899,
          blockHash: '0x5948d965ab5805ace0bc7556672c8f475515ac853c4477f17cc49287f402430e',
          transactionIndex: 65,
          address: '0x6A12C2Cc8AF31f125484EB685F7c0bfcE280B919',
          data: '0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          topics: [
            '0x83f5257fc3f5f94fa653d44d66c91bba315ce36d9c3c00b14278da4d3b635647',
            '0x0000000000000000000000008f0a62ff2ae1fa08b25070b8b5138fb45630456f',
            '0x000000000000000000000000fcd9c98aae3229a5984a27dee7e6c3b77f1622b5',
          ],
          transactionHash: '0x1f6e88067388a82924535eaa2c4af83143652dba3ec518fbc1ee24d7522efa02',
          logIndex: 226
        }]
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
            from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            value: "2000000000000000000",
            logs
          }
        })

        expect(mockedTransaction.transaction._id).toBeDefined()
        confirm(mockedTransaction)

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let receipt = await provider.getTransactionReceipt(mockedTransaction.transaction._id);
        expect(receipt.from).toEqual('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
        expect(receipt.to).toEqual('0x5Af489c8786A018EC4814194dC8048be1007e390')
        expect(receipt.logs).toEqual(logs)
      })

      it('mocks a transaction', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
            from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            value: "2000000000000000000"
          }
        })

        expect(mockedTransaction.transaction._id).toBeDefined()
        confirm(mockedTransaction)

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let transaction = await provider.getTransaction(mockedTransaction.transaction._id);
        expect(transaction.from).toEqual('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
        expect(transaction.to).toEqual('0x5Af489c8786A018EC4814194dC8048be1007e390')
        expect(transaction.value.toString()).toEqual('2000000000000000000')
      })

      it('mocks a complex contract transaction', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'route',
            params: {
              path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
              amounts: ["773002376389189", "1000000000000000000", "3623748721"]
            }
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );

        let signer = provider.getSigner();

        let transaction = await contract.connect(signer).route(
          ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          ["773002376389189", "1000000000000000000", "3623748721"],
          [],
          [],
          [],
          { value: 0 }
        )

        expect(transaction).toBeDefined()

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a complex contract transaction with tuple arugments', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_PERMIT2","type":"address"},{"internalType":"address","name":"_FORWARDER","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"exchange","type":"address"}],"name":"Disabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"exchange","type":"address"}],"name":"Enabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"FORWARDER","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"exchange","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"enable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"exchanges","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"bool","name":"permit2","type":"bool"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"feeAmount","type":"uint256"},{"internalType":"address","name":"tokenInAddress","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"address","name":"tokenOutAddress","type":"address"},{"internalType":"address","name":"paymentReceiverAddress","type":"address"},{"internalType":"address","name":"feeReceiverAddress","type":"address"},{"internalType":"uint8","name":"exchangeType","type":"uint8"},{"internalType":"uint8","name":"receiverType","type":"uint8"},{"internalType":"bytes","name":"exchangeCallData","type":"bytes"},{"internalType":"bytes","name":"receiverCallData","type":"bytes"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct IDePayRouterV2.Payment","name":"payment","type":"tuple"}],"name":"pay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"bool","name":"permit2","type":"bool"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"feeAmount","type":"uint256"},{"internalType":"address","name":"tokenInAddress","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"address","name":"tokenOutAddress","type":"address"},{"internalType":"address","name":"paymentReceiverAddress","type":"address"},{"internalType":"address","name":"feeReceiverAddress","type":"address"},{"internalType":"uint8","name":"exchangeType","type":"uint8"},{"internalType":"uint8","name":"receiverType","type":"uint8"},{"internalType":"bytes","name":"exchangeCallData","type":"bytes"},{"internalType":"bytes","name":"receiverCallData","type":"bytes"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct IDePayRouterV2.Payment","name":"payment","type":"tuple"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IPermit2.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IPermit2.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"pay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api,
            method: 'pay',
            params: {
              payment: {
                amountIn: ethers.BigNumber.from('1000000'),
                permit2: false,
                paymentAmount: ethers.BigNumber.from('1000000'),
                feeAmount: 0,
                tokenInAddress: Blockchains[blockchain].zero,
                exchangeAddress: Blockchains[blockchain].zero,
                tokenOutAddress: Blockchains[blockchain].currency.address,
                paymentReceiverAddress: Blockchains[blockchain].zero,
                feeReceiverAddress: Blockchains[blockchain].zero,
                exchangeType: 1,
                receiverType: 0,
                exchangeCallData: anything,
                receiverCallData: Blockchains[blockchain].zero,
                deadline: anything,
              }
            }
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );

        let signer = provider.getSigner();

        let transaction = await contract.connect(signer)['pay((uint256,bool,uint256,uint256,address,address,address,address,address,uint8,uint8,bytes,bytes,uint256))'](
          {
            amountIn: ethers.BigNumber.from('1000000'),
            permit2: false,
            paymentAmount: ethers.BigNumber.from('1000000'),
            feeAmount: 0,
            tokenInAddress: Blockchains[blockchain].zero,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: Blockchains[blockchain].currency.address,
            paymentReceiverAddress: Blockchains[blockchain].zero,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 1,
            receiverType: 0,
            exchangeCallData: Blockchains[blockchain].zero,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: 0,
          },
          { value: 0 }
        )

        expect(transaction).toBeDefined()
        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a complex contract transaction also with BigNumbers', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'route',
            params: {
              path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
              amounts: [ethers.BigNumber.from("773002376389189"), ethers.BigNumber.from("1000000000000000000"), ethers.BigNumber.from("3623748721")]
            }
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );

        let signer = provider.getSigner();

        let transaction = await contract.connect(signer).route(
          ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          ["773002376389189", "1000000000000000000", "3623748721"],
          [],
          [],
          [],
          { value: 0 }
        )

        expect(transaction).toBeDefined()

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a complex contract transaction also when params single BigNumbers are set to anything', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'swapTokensForExactTokens',
            params: {
              amountInMax: anything,
              amountOut: ethers.BigNumber.from('1000000000'),
              path: ['0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb','0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'],
              to: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
            }
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );

        let signer = provider.getSigner();

        let transaction = await contract.connect(signer).swapTokensForExactTokens(
          ethers.BigNumber.from('1000000000'),
          ethers.BigNumber.from('1000000000'),
          ['0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb','0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'],
          '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          '1625141777',
          { value: 0 }
        )

        expect(transaction).toBeDefined()

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('also mocks transaction receipts for simple transactions', async ()=> {
        
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
      })

      it('requires you to mock contract call transactions', async ()=> {
        
        mock(blockchain)

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
          provider
        );

        let signer = provider.getSigner();

        await expect(
          contract.connect(signer).route(
            ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
            ["773002376389189", "1000000000000000000", "3623748721"],
            [],
            [],
            [],
            { value: 0 }
          )
        ).rejects.toEqual(
          "Web3Mock: Please mock the transaction to: 0xae60ac8e69414c2dc362d0e6a03af643d1d85b92"
        )
      })

      it('does not raise an error but asks you to mock the transaction if other mocks exist', async ()=> {
        
        mock({
          blockchain,
          request: {
            api: []
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
          provider
        );

        let signer = provider.getSigner();

        await expect(
          contract.connect(signer).route(
            ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
            ["773002376389189", "1000000000000000000", "3623748721"],
            [],
            [],
            [],
            { value: 0 }
          )
        ).rejects.toEqual(
          "Web3Mock: Please mock the transaction to: 0xae60ac8e69414c2dc362d0e6a03af643d1d85b92"
        )
      })

      it('raises an error if a complex mock does not provide the api in the mock configuration', async ()=> {
        
        await expect(()=>{
          mock({
            blockchain,
            transaction: {
              to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
              from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
              method: 'route',
              params: {
                path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
                amounts: ["773002376389189", "1000000000000000000", "1"]
              }
            }
          })
        }).toThrowError(`Web3Mock: Please provide the api for the transaction: {\"blockchain\":\"${blockchain}\",\"transaction\":{\"to\":\"0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92\",\"from\":\"0xd8da6bf26964af9d7eed9e03e53415d37aa96045\",\"method\":\"route\",\"params\":{\"path\":[\"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\",\"0xa0bed124a09ac2bd941b10349d8d224fe3c955eb\"],\"amounts\":[\"773002376389189\",\"1000000000000000000\",\"1\"]},\"api\":[\"PLACE API HERE\"]}}`)
      })

      it('does not call the mock if `from` of the transaction mock is not matching', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "0x998D342D6a19CE1d9ad32cd77ec075431bA75dA3",
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: "1000000000000000000"
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        await expect(
          signer.sendTransaction({
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: ethers.utils.parseEther("1")
          })
        ).rejects.toEqual(
          "Web3Mock: Please mock the transaction to: 0x5af489c8786a018ec4814194dc8048be1007e390"
        )

        expect(mockedTransaction).not.toHaveBeenCalled();
      })

      it('does not call the mock if `to` of the transaction mock is not matching', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: "0x9EDF1FF5C67f102b55bad0017811399Fe6891140",
            value: "1000000000000000000"
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        await expect(
          signer.sendTransaction({
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: ethers.utils.parseEther("1")
          })
        ).rejects.toEqual(
          "Web3Mock: Please mock the transaction to: 0x5af489c8786a018ec4814194dc8048be1007e390"
        )
        
        expect(mockedTransaction).not.toHaveBeenCalled()
      })

      it('does not call the mock if `value` of the transaction mock is not matching', async ()=> {
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: "9000000000000000000"
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        await expect(
          signer.sendTransaction({
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: ethers.utils.parseEther("1")
          })
        ).rejects.toEqual(
          "Web3Mock: Please mock the transaction to: 0x5af489c8786a018ec4814194dc8048be1007e390"
        )
        
        expect(mockedTransaction).not.toHaveBeenCalled()
      })

      it('suggests how to mock if an error if a complex mock does not match the actual call', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'route',
            params: {
              path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
              amounts: ["773002376389189", "1000000000000000000", "1"]
            }
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );

        let signer = provider.getSigner();

        await expect(
          contract.connect(signer).route(
            ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
            ["773002376389189", "1000000000000000000", "3623748721"],
            [],
            [],
            [],
            { value: 0 }
          )
        ).rejects.toEqual(
          `Web3Mock: Please mock the transaction: {\"blockchain\":\"${blockchain}\",\"transaction\":{\"to\":\"0xae60ac8e69414c2dc362d0e6a03af643d1d85b92\",\"api\":[\"PLACE API HERE\"],\"method\":\"route\",\"params\":{\"path\":[\"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\",\"0xa0bed124a09ac2bd941b10349d8d224fe3c955eb\"],\"amounts\":[\"773002376389189\",\"1000000000000000000\",\"3623748721\"],\"addresses\":[],\"plugins\":[],\"data\":[]}}}`
        )
      })

      it('mocks a complex contract call transaction by fully mocking params with anything', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'route',
            params: anything
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );

        let signer = provider.getSigner();

        let transaction = await contract.connect(signer).route(
          ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          ["773002376389189", "1000000000000000000", "3623748721"],
          [],
          [],
          [],
          { value: 0 }
        )

        expect(transaction).toBeDefined()

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a complex contract call transaction by partialy mocking params array value with anything', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'route',
            params: {
              path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
              amounts: ["773002376389189", "1000000000000000000", anything]
            }
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );  

        let signer = provider.getSigner();

        let transaction = await contract.connect(signer).route(
          ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          ["773002376389189", "1000000000000000000", "3623748721"],
          [],
          [],
          [],
          { value: 0 }
        )

        expect(transaction).toBeDefined()

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('mocks a complex contract call transaction by partialy mocking params attribute value with anything', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
            api: api,
            method: 'route',
            params: {
              path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
              amounts: anything
            }
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
          api,
          provider
        );

        let signer = provider.getSigner();

        let transaction = await contract.connect(signer).route(
          ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          ["773002376389189", "1000000000000000000", "3623748721"],
          [],
          [],
          [],
          { value: 0 }
        )

        expect(transaction).toBeDefined()

        expect(mockedTransaction).toHaveBeenCalled()
      })


      it('fails the transaction if you mock an Error', async ()=>{

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
            from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            value: "2000000000000000000",
            return: Error('Some issue')
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        await expect(
          signer.sendTransaction({
            to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
            value: ethers.utils.parseEther("2")
          })
        ).rejects.toEqual(new Error('Some issue'))

        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('allows to delay the transaction', async ()=>{

        let mockedTransaction = mock({
          blockchain,
          transaction: {
            delay: 1000,
            to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
            from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            value: "2000000000000000000"
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();

        let now = new Date().getTime()
        await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("2")
        })
        expect((new Date().getTime() - now) > 1000).toEqual(true)
        
        expect(mockedTransaction).toHaveBeenCalled()
      })

      it('allows to replace a transaction', async ()=>{

        let transaction = {
          to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
          from: accounts[0],
          value: "2000000000000000000"
        }

        let transactionMock = mock({
          blockchain,
          transaction
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);
        let signer = provider.getSigner();

        let sentTransaction = await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("2")
        })

        let transactionError
        sentTransaction.wait(1).catch((error)=>{
          transactionError = error
        })

        let replacingTransactionMock = mock({
          blockchain,
          transaction
        })

        replace(transactionMock, replacingTransactionMock)

        await new Promise((r) => setTimeout(r, 2000));

        expect(transactionError.code).toEqual('TRANSACTION_REPLACED')
        expect(transactionError.receipt.status).toEqual(1)
      })

      it('allows to replace a transaction and let the replacing transaction fail', async ()=>{

        let transaction = {
          to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
          from: accounts[0],
          value: "2000000000000000000"
        }

        let transactionMock = mock({
          blockchain,
          transaction
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);
        let signer = provider.getSigner();

        let sentTransaction = await signer.sendTransaction({
          to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
          value: ethers.utils.parseEther("2")
        })

        let transactionError
        sentTransaction.wait(1).catch((error)=>{
          transactionError = error
        })

        let replacingTransactionMock = mock({
          blockchain,
          transaction
        })

        replace(transactionMock, replacingTransactionMock, false)

        await new Promise((r) => setTimeout(r, 2000));

        expect(transactionError.code).toEqual('TRANSACTION_REPLACED')
        expect(transactionError.receipt.status).toEqual(0)
      })
    })
  })
});
