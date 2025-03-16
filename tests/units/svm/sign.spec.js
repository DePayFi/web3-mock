import { mock, resetMocks } from 'src'
import { supported } from "src/blockchains"

describe('solana mock signatures', ()=> {

  supported.svm.forEach((blockchain)=>{

    describe(blockchain, ()=> {
      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('raises an error to mock signature request if signature has not been mocked', async ()=> {
        
        mock(blockchain)

        let signer = window.solana
        let message = "This is a message to be signed\n\nAnd a new line"
        const encodedMessage = new TextEncoder().encode(message)

        expect(
          ()=>signer.signMessage(encodedMessage)
        ).toThrow(
          `Web3Mock: Please mock the sign request: {"blockchain":"solana","signature":{"params":[{"0":84,"1":104,"2":105,"3":115,"4":32,"5":105,"6":115,"7":32,"8":97,"9":32,"10":109,"11":101,"12":115,"13":115,"14":97,"15":103,"16":101,"17":32,"18":116,"19":111,"20":32,"21":98,"22":101,"23":32,"24":115,"25":105,"26":103,"27":110,"28":101,"29":100,"30":10,"31":10,"32":65,"33":110,"34":100,"35":32,"36":97,"37":32,"38":110,"39":101,"40":119,"41":32,"42":108,"43":105,"44":110,"45":101}],"return":"PUT SIGNATURE HERE"}}`
        )
      })

      it('mocks signature request and returns given signature', async()=> {
        
        let message = "This is a message to be signed\n\nAnd a new line"
        const encodedMessage = new TextEncoder().encode(message)

        mock({
          blockchain,
          signature: {
            params: [encodedMessage],
            return: [145, 241, 134, 253, 144, 164, 58, 132, 158, 215, 157, 253, 203, 13, 92, 29, 13, 176, 249, 226, 36, 199, 149, 12, 100, 27, 76, 20, 160, 63, 255, 140, 6, 49, 99, 33, 41, 163, 77, 65, 238, 33, 175, 100, 147, 147, 54, 117, 79, 99, 59, 159, 228, 241, 175, 28, 255, 55, 210, 215, 55, 56, 68, 14]
          }
        })

        let signer = window.solana
        let signedMessage = await signer.signMessage(encodedMessage)

        expect(signedMessage.signature).toEqual([145, 241, 134, 253, 144, 164, 58, 132, 158, 215, 157, 253, 203, 13, 92, 29, 13, 176, 249, 226, 36, 199, 149, 12, 100, 27, 76, 20, 160, 63, 255, 140, 6, 49, 99, 33, 41, 163, 77, 65, 238, 33, 175, 100, 147, 147, 54, 117, 79, 99, 59, 159, 228, 241, 175, 28, 255, 55, 210, 215, 55, 56, 68, 14])
      })
    })
  })
})
