import { mock, resetMocks, anything } from 'dist/esm/index.solana'
import { Connection, PublicKey } from '@depay/solana-web3.js'
import { supported } from "src/blockchains"

describe('mocks solana wallet balances', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      afterEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('allows to mock a balance with 0', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let balanceMock = mock({
          provider: connection,
          blockchain,
          balance: {
            for: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
            return: 0
          }
        })

        let balance = await connection.getBalance(new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'))

        expect(balance).toEqual(0)
        expect(balanceMock).toHaveBeenCalled()
      })

      it('mocks a balance', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let balanceMock = mock({
          provider: connection,
          blockchain,
          balance: {
            for: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
            return: 232111122321
          }
        })

        let balance = await connection.getBalance(new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'))

        expect(balance).toEqual(232111122321)
        expect(balanceMock).toHaveBeenCalled()
      })

      it('suggests how to mock a balance', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        mock({
          blockchain,
          provider: connection
        })

        await expect(
          connection.getBalance(new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'))
        ).rejects.toEqual(
          new Error('failed to get balance of account 5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa: Web3Mock: Please mock the balance request: {"blockchain":"solana","balance":{"for":"5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa","return":"PUT BALANCE AMOUNT HERE"}}')
        )
      })

      it('fails if balance mock does not match balance request', async ()=>{

        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let balanceMock = mock({
          blockchain,
          provider: connection,
          balance: {
            for: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
            return: 232111122321
          }
        })

        await expect(
          connection.getBalance(new PublicKey('XkCriyrNwS3G4rzAXtG5B1nnvb5Ka1JtCku93VqeKAr'))
        ).rejects.toEqual(
          new Error('failed to get balance of account XkCriyrNwS3G4rzAXtG5B1nnvb5Ka1JtCku93VqeKAr: Web3Mock: Please mock the balance request: {"blockchain":"solana","balance":{"for":"XkCriyrNwS3G4rzAXtG5B1nnvb5Ka1JtCku93VqeKAr","return":"PUT BALANCE AMOUNT HERE"}}')
        )
      })

      it('fails the balance if you mock an Error', async ()=> {
        
        let connection = new Connection('https://api.mainnet-beta.solana.com')

        let balanceMock = mock({
          blockchain,
          provider: connection,
          balance: {
            for: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
            return: Error('some error')
          }
        })

        await expect(
          connection.getBalance(new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'))
        ).rejects.toEqual(new Error('failed to get balance of account 5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa: Error: some error'))

        expect(balanceMock).toHaveBeenCalled()
      })
    })
  })
});
