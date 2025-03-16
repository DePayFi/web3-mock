import { ethers, toUtf8Bytes, hexlify } from 'ethers'
import { mock, resetMocks, confirm, anything } from 'src'
import { supported } from "src/blockchains"

describe('mock signatures', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      class WalletConnectStub {}

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, connector: WalletConnectStub, accounts: { return: accounts }, wallet: 'walletconnect' }))

      it('raises an error to mock signature request if signature has not been mocked', async ()=> {
        
        mock(blockchain)

        let message = "This is a message to be signed\n\nAnd a new line"
        const messageUtf8 = toUtf8Bytes(message)
        const messageHex = hexlify(messageUtf8).substring(2)

        await expect(
          WalletConnectStub.instance.signPersonalMessage([`0x${messageHex}`, accounts[0]])
        ).rejects.toEqual(
          "Web3Mock: Please mock the sign request: {\"blockchain\":\""+blockchain+"\",\"signature\":{\"params\":[\"0xd8da6bf26964af9d7eed9e03e53415d37aa96045\",\"0x546869732069732061206d65737361676520746f206265207369676e65640a0a416e642061206e6577206c696e65\"],\"return\":\"PUT SIGNATURE HERE\"}}"
        )
      })

      it('mocks signature request and returns given signature', async()=> {
        
        let message = "This is a message to be signed\n\nAnd a new line"
        const messageUtf8 = toUtf8Bytes(message)
        const messageHex = hexlify(messageUtf8).substring(2)

        mock({
          blockchain,
          signature: {
            params: [accounts[0], `0x${messageHex}`],
            return: "0x123456"
          }
        })

        let signature = await WalletConnectStub.instance.signPersonalMessage([`0x${messageHex}`, accounts[0]])

        expect(signature).toEqual("0x123456")
      })

      it('allows to delay signature', async()=> {
        
        let message = "This is a message to be signed\n\nAnd a new line"
        const messageUtf8 = toUtf8Bytes(message)
        const messageHex = hexlify(messageUtf8).substring(2)

        mock({
          blockchain,
          signature: {
            params: [accounts[0], `0x${messageHex}`],
            return: "0x123456",
            delay: 1100
          }
        })

        let now = new Date().getTime()
        let signature = await WalletConnectStub.instance.signPersonalMessage([`0x${messageHex}`, accounts[0]])
        expect((new Date().getTime() - now) >= 1000).toEqual(true)
      })
    })
  })
});
