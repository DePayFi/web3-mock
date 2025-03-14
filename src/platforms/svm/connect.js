import raise from '../../raise'
import normalize from '../../normalize'
import { findMock } from './findMock'
import { PublicKey } from '@depay/solana-web3.js'

let requestAccounts = ({ mock })=> {
  mock.calls.add({})
  if (mock.accounts.return instanceof Error) {
    return Promise.reject(mock.accounts.return)
  } else {
    return Promise.resolve(
      mock.accounts.return
    )
  }
}

let connect = function ({ blockchain, provider }) {

  let mock = findMock({ type: 'accounts', blockchain, provider })

  if (mock) {
    if(mock.accounts.delay) {
      return new Promise((resolve)=>{
        setTimeout(()=>{
          requestAccounts({ mock }).then((accounts)=>{ resolve({ publicKey: new PublicKey(accounts[0]) }) }) 
        }, mock.accounts.delay)
      })
    } else {
      return requestAccounts({ mock }).then((accounts)=>{ return { publicKey: new PublicKey(accounts[0]) } })
    }
  } else {
    raise(
      'Web3Mock: Please mock accounts: ' +
      JSON.stringify({
        blockchain,
        accounts: {
          return: ['YOUR ACCOUNT HERE']
        }
      })
    )
  }
}

export { connect }
