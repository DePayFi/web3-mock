import raise from '../../raise'
import normalize from '../../normalize'
import { findMock } from './findMock'

let requestAccounts = ({ mock, params })=> {
  mock.calls.add(params || {})
  if (mock.accounts.return instanceof Error) {
    return Promise.reject(mock.accounts.return)
  } else {
    return Promise.resolve(
      mock.accounts.return
    )
  }
}

let getAccounts = function ({ blockchain, params, provider }) {

  let mock = findMock({ type: 'accounts', blockchain, params, provider })

  if (mock) {
    if(mock.accounts.delay) {
      return new Promise((resolve)=>{
        setTimeout(()=>resolve(requestAccounts({ mock, params })), mock.accounts.delay)
      })
    } else {
      return requestAccounts({ mock, params })
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

export { getAccounts }
