import { ethers } from 'ethers'
import { call } from './call'
import { sendTransaction } from './transactions'

let request = ({ request, provider }) => {
  switch (request.method) {
    case 'eth_chainId':
      return Promise.resolve('0x1')
      break

    case 'eth_getBalance':
      return Promise.resolve(ethers.BigNumber.from('0'))
      break

    case 'net_version':
      return Promise.resolve(1)
      break

    case 'eth_requestAccounts':
    case 'eth_accounts':
      return Promise.resolve(['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'])
      break

    case 'eth_estimateGas':
      return Promise.resolve('0x2c4a0')
      break

    case 'eth_blockNumber':
      return Promise.resolve('0x5daf3b')
      break

    case 'eth_call':
      // return call({ params: request.params, provider })
      break

    case 'eth_sendTransaction':
      return sendTransaction({ params: request.params, provider })
      break

    case 'eth_getTransactionByHash':
      return Promise.resolve({
        blockHash: '0x50bc252c171eedfde3a2cb280616c5c42de3698eb5aa693002e46e5a812a4ff7',
        blockNumber: '0xc544',
        from: '0xb7576e9d314df41ec5506494293afb1bd5d3f65d',
        gas: '0x29857',
        gasPrice: '0xba43b7400',
        hash: '0xbb8d9e2262cd2d93d9bf7854d35f8e016dd985e7b3eb715d0d7faf7290a0ff4d',
        input:
          '0x606060405261022e806100136000396000f300606060405260e060020a6000350463201745d5811461003c578063432ced04146100d257806379ce9fac14610141578063d5fa2b00146101a8575b005b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081206001810180548254600160a060020a0319908116909355919091169055600160a060020a038316906803bd913e6c1df40000606082818181858883f1505060405184935060008051602061020e833981519152929150a2505050565b61003a600435600081815260208190526040812060010154600160a060020a031614801561010957506803bd913e6c1df400003410155b1561013e57604060009081206001018054600160a060020a03191633179055819060008051602061020e833981519152906060a25b50565b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081206001018054600160a060020a03191684179055819060008051602061020e833981519152906060a2505050565b61003a6004356024356000828152602081905260409020600101548290600160a060020a039081163391909116141561020857604060009081208054600160a060020a03191684179055819060008051602061020e833981519152906060a25b5050505600a6697e974e6a320f454390be03f74955e8978f1a6971ea6730542e37b66179bc',
        nonce: '0x0',
        r: '0xcfb56087c168a48bc69bd2634172fd9defd77bd172387e2137643906ff3606f6',
        s: '0x3474eb47999927f2bed4d4ec27d7e8bb4ad17c61d76761e40fdbd859d84c3bd5',
        to: null,
        transactionIndex: '0x1',
        type: '0x0',
        v: '0x1c',
        value: '0x0',
      })
      break

    case 'eth_getTransactionReceipt':
      return Promise.resolve({
        transactionHash: '0xbb8d9e2262cd2d93d9bf7854d35f8e016dd985e7b3eb715d0d7faf7290a0ff4d',
        transactionIndex: '0x1',
        blockNumber: '0xc544',
        blockHash: '0x50bc252c171eedfde3a2cb280616c5c42de3698eb5aa693002e46e5a812a4ff7',
        cumulativeGasUsed: '0x33bc',
        gasUsed: '0x4dc',
        logs: [],
        logsBloom: '0x0000000000000000000000000000000000000000',
        status: '0x1',
      })
      break

    default:
      throw 'Web3Mock Ethereum request: Unknown request method ' + request.method + '!'
  }
}

export { request }
