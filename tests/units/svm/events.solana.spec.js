import { ethers } from 'ethers'
import { mock, resetMocks, trigger } from 'dist/esm/index.svm'
import { PublicKey } from '@depay/solana-web3.js'
import { supported } from "src/blockchains"

describe('mock solana events', ()=> {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)

      it('allows to trigger events', async ()=> {
        
        mock('solana')

        let account = '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'
        let accountChangedTo

        global.solana.on('accountChanged', (account)=>{
          accountChangedTo = account.toString()
        })

        trigger('accountChanged', new PublicKey(account))

        expect(accountChangedTo).toEqual(account)
      })

      it('allows to deregister events', async ()=> {
        
        mock('solana')

        let account = '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'
        let accountChangedTo

        const onAccountChanged = (account)=>{
          accountChangedTo = account.toString()
        }

        global.solana.on('accountChanged', onAccountChanged)
        global.solana.removeListener('accountChanged', onAccountChanged)

        trigger('accountChanged', new PublicKey(account))

        expect(accountChangedTo).toEqual(undefined)
      })
    })
  })
});
