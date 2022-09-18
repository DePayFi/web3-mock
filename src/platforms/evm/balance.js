import raise from '../../raise'
import { findMock } from './findMock'
import { ethers } from 'ethers'

let balance = function ({ blockchain, params, provider }) {
  params = (typeof params == 'object') ? params : { address: params }
  let mock = findMock({ blockchain, type: 'balance', params, provider })

  if (mock && mock.balance?.return) {
    mock.calls.add(params)
    if (mock?.balance?.return instanceof Error) {
      return Promise.reject(mock.balance.return)
    } else {
      return Promise.resolve(ethers.BigNumber.from(mock.balance.return))
    }
  } else {
    raise(
      'Web3Mock: Please mock the balance request: ' +
      JSON.stringify({
        blockchain: blockchain,
        balance: {
          for: params.address,
          return: 'PUT BALANCE AMOUNT HERE',
        },
      })
    )
  }
}

export { balance }
