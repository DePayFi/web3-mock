import raise from '../../raise'
import { findMock } from './findMock'

let balance = function ({ blockchain, params, provider }) {
  let mock = findMock({ blockchain, type: 'balance', params, provider })

  if (mock && mock.balance?.return) {
    mock.calls.add(params)
    if (mock?.balance?.return instanceof Error) {
      return Promise.reject(mock.balance.return)
    } else {
      return Promise.resolve(mock.balance.return)
    }
  } else {
    raise(
      'Web3Mock: Please mock the balance request: ' +
      JSON.stringify({
        blockchain: blockchain,
        balance: {
          for: params,
          return: 'PUT BALANCE AMOUNT HERE',
        },
      })
    )
  }
}

export { balance }
