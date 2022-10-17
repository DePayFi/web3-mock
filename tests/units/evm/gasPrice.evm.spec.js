import { ethers } from 'ethers'
import { mock } from 'src/index.evm'
import { supported } from "src/blockchains.evm"

describe('evm getGasPrice (evm)', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      it('mocks default gasPrice', async () => {

        mock({ blockchain })
        
        let gasPrice = await global.ethereum.request({ method: 'eth_getGasPrice' })

        expect(ethers.BigNumber.from(gasPrice).toString()).toEqual('13370000000')
      })
    })
  })
})
