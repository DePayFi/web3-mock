import { findMock } from '../mocks/findMock'
import { ethers } from 'ethers'

let balance = function ({ params, provider }) {
  let mock = findMock({ type: 'balance', params, provider })

  if (mock && mock.balance?.return) {
    mock.calls.add(params)
    return Promise.resolve(ethers.BigNumber.from(mock.balance.return))
  } else {
    throw (
      'Web3Mock: Please mock the balance request: ' +
      JSON.stringify({
        blockchain: 'ethereum',
        balance: {
          for: params,
          return: 'PUT BALANCE AMOUNT HERE',
        },
      })
    )
  }
}

export { balance }
