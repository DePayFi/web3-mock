import {ethers} from 'ethers'
import {mock, resetMocks} from 'src'
import { supported } from "src/blockchains"

describe('evm mock signatures', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('raises an error to mock signature request if signature has not been mocked', async ()=> {
        
        mock(blockchain)

        let provider = new ethers.providers.Web3Provider(global.ethereum);

        let signer = provider.getSigner();
        let message = "This is a message to be signed\n\nAnd a new line"

        await expect(
          signer.signMessage(message)
        ).rejects.toEqual(
          "Web3Mock: Please mock the sign request: {\"blockchain\":\""+blockchain+"\",\"signature\":{\"params\":[\"0x546869732069732061206d65737361676520746f206265207369676e65640a0a416e642061206e6577206c696e65\",\"0xd8da6bf26964af9d7eed9e03e53415d37aa96045\"],\"return\":\"PUT SIGNATURE HERE\"}}"
        )
      })

      it('mocks signature request and returns given signature', async()=> {
        
        let message = "This is a message to be signed\n\nAnd a new line"
        const messageUtf8 = ethers.utils.toUtf8Bytes(message)
        const messageHex = ethers.utils.hexlify(messageUtf8).substring(2)

        mock({
          blockchain,
          signature: {
            params: [accounts[0], `0x${messageHex}`],
            return: "0x123456"
          }
        })

        let provider = new ethers.providers.Web3Provider(global.ethereum);
        let signer = provider.getSigner();

        let signature = await signer.signMessage(message)

        expect(signature).toEqual("0x123456")
      })

      it('mocks signature request and returns given signature for typed data', async()=> {
        let message = "This is a message to be signed\n\nAnd a new line"
        const messageUtf8 = ethers.utils.toUtf8Bytes(message)
        const messageHex = ethers.utils.hexlify(messageUtf8).substring(2)
        mock({
          blockchain,
          signature: {
            params: [accounts[0], `0x${messageHex}`],
            return: "0x123456"
          }
        })
        let provider = new ethers.providers.Web3Provider(global.ethereum);
        const signature = await provider.send('eth_signTypedData_v4',
            [accounts[0], `0x${messageHex}`])

        expect(signature).toEqual("0x123456")
      })

      it('allows to delay signature', async()=> {
        
        let message = "This is a message to be signed\n\nAnd a new line"
        const messageUtf8 = ethers.utils.toUtf8Bytes(message)
        const messageHex = ethers.utils.hexlify(messageUtf8).substring(2)

        mock({
          blockchain,
          signature: {
            params: [accounts[0], `0x${messageHex}`],
            return: "0x123456",
            delay: 1100
          }
        })

        let now = new Date().getTime()
        let provider = new ethers.providers.Web3Provider(global.ethereum);
        let signer = provider.getSigner();
        let signature = await signer.signMessage(message)
        expect((new Date().getTime() - now) >= 1000).toEqual(true)
      })
    })
  })
});
