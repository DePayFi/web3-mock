import { Blockchain } from '@depay/web3-blockchains'
import { mock, resetMocks } from 'src/index.evm'
import { supported } from "src/blockchains.evm"

describe('mocks evm basics (evm)', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      beforeEach(()=>{
        mock(blockchain)
      })

      it('fails if requested method is not implemented', ()=>{
        expect(()=>{
          global.ethereum.request({ method: 'nonexisting' })
        }).toThrowError('Web3Mock request: Unknown request method nonexisting!')
      })
      
      it('mocks default request for eth_chainId', async ()=> {
        let chainId = await global.ethereum.request({ method: 'eth_chainId' })
        expect(chainId).toEqual(Blockchain.findByName(blockchain).id);
      });

      it('mocks default request for net_version', async ()=>{
        let networkVersion = await global.ethereum.request({ method: 'net_version' })
        expect(networkVersion).toEqual(Blockchain.findByName(blockchain).networkId);
      })

      it('mocks default request for eth_getTransactionCount', async ()=>{
        let transactionCount = await global.ethereum.request({ method: 'eth_getTransactionCount', params: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] })
        expect(transactionCount).toEqual('0x00');
      })

      it('mocks default request for eth_estimateGas', async ()=>{
        let gas = await global.ethereum.request({ method: 'eth_estimateGas' })
        expect(gas).toEqual('0x2c4a0');
      })
      
      it('mocks default request for eth_blockNumber', async ()=>{
        let block = await global.ethereum.request({ method: 'eth_blockNumber' })
        expect(block).toEqual('0x01');
      })

      it('mocks default request for eth_subscribe', async ()=>{
        let result = await global.ethereum.request({ method: 'eth_subscribe' })
        expect(result).toEqual(undefined);
      })
    })
  })
});
