import { ethers } from 'ethers'
import { mock, resetMocks, confirm } from 'dist/esm/index.solana'
import { resetCache } from '@depay/web3-client'
import { supported } from "src/blockchains"

describe('mock solana getTransaction including events', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']

      beforeEach(()=>{
        resetMocks()
        resetCache()
        mock({ blockchain, accounts: { return: accounts } })
      })

      it('provides transaction log messages', async ()=> {

        const log = 'Program data: hIidd1v+4RQV8q/Ckfb9cpDS30nV3iUjd1DYaBz3k3UNXkQrS4T0IAUAAAAAAAAABpcOCgAAAAD7/75R4XMRYKqOuRy/4x2NZ70lz8LuEgGXjlwasyL8zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPeTUUVJkNAwHnf8dGovt+BfbC32vsn+NVNczDbYQ8sPgD5cAAAAAAEhAcIwVXjmZ+ZDjJzXIpw47JEkIjmsqSJf7v6bvZSJLoIYBAAAAAAA='
        
        let mockedTransaction = mock({
          blockchain,
          transaction: {
            from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
            logMessages: [
              log
            ],
          }
        })

        confirm(mockedTransaction)

        let confirmedTransaction = await window.solana.getTransaction(mockedTransaction.transaction._id)

        expect(confirmedTransaction.meta.logMessages[0]).toEqual(log)

      })
    })
  })
})
