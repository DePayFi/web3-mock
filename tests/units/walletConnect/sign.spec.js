import { ethers } from 'ethers'
import { mock, resetMocks, confirm, anything } from 'src'

describe('mock signatures', ()=> {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      let connector
      beforeEach(resetMocks)
      beforeEach(()=>{ connector = {} })
      beforeEach(()=>mock({ blockchain, connector, accounts: { return: accounts }, wallet: 'walletconnect' }))

      it('raises an error to mock signature request if signature has not been mocked', async ()=> {
        
        mock(blockchain)

        let message = "This is a message to be signed\n\nAnd a new line"
        const messageUtf8 = ethers.utils.toUtf8Bytes(message)
        const messageHex = ethers.utils.hexlify(messageUtf8).substring(2)

        await expect(
          connector.signPersonalMessage([`0x${messageHex}`, accounts[0]])
        ).rejects.toEqual(
          "Web3Mock: Please mock the sign request: {\"blockchain\":\""+blockchain+"\",\"signature\":{\"params\":[\"0xd8da6bf26964af9d7eed9e03e53415d37aa96045\",\"0x546869732069732061206d65737361676520746f206265207369676e65640a0a416e642061206e6577206c696e65\"],\"return\":\"PUT SIGNATURE HERE\"}}"
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

        let signature = await connector.signPersonalMessage([`0x${messageHex}`, accounts[0]])

        expect(signature).toEqual("0x123456")
      })
    })
  })
});
