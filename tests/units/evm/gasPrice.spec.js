import { ethers } from 'ethers'
import { mock } from 'src'
import { supported } from "src/blockchains"

describe('evm getGasPrice', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      it('mocks default gasPrice', async () => {

        mock({ blockchain })
        
        let gasPrice = await global.ethereum.request({ method: 'eth_getGasPrice' })

        expect(BigInt(gasPrice).toString()).toEqual('13370000000')
      })
    })
  })
})
