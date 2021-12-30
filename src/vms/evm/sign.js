import raise from '../../raise'
import { findMock } from './findMock'
import { ethers } from 'ethers'

let sign = function ({ blockchain, params, provider }) {
  let mock = findMock({ blockchain, type: 'signature', params, provider })

  if (mock && mock.signature?.return) {
    mock.calls.add(params)

    if(mock.signature.delay) {
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          if (mock.signature.return instanceof Error) {
            reject(mock.signature.return)
          } else {
            resolve(mock.signature.return)
          }
        }, mock.signature.delay)
      })
    } else {
      if (mock.signature.return instanceof Error) {
        return Promise.reject(mock.signature.return)
      } else {
        return Promise.resolve(mock.signature.return)
      }
    }
  } else {
    raise(
      'Web3Mock: Please mock the sign request: ' +
      JSON.stringify({
        blockchain: blockchain,
        signature: {
          params: params,
          return: 'PUT SIGNATURE HERE',
        },
      })
    )
  }
}

export { sign }
