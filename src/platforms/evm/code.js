import raise from '../../raise'
import normalize from '../../normalize'
import { findMock } from './findMock'

let callMock = ({ mock, params, provider })=> {
  mock.calls.add(params)
  if (mock.code.return instanceof Error) {
    return Promise.reject({ 
      error: {
        message: mock.code.return.message
      }
    })
  } else {
    return Promise.resolve(mock.code.return)
  }
}

let code = function ({ blockchain, params, provider }) {
  let mock = findMock({ type: 'code', params, provider })

  if (mock) {
    if(mock.code.delay) {
      return new Promise((resolve)=>{
        setTimeout(()=>resolve(callMock({ mock, params, provider })), mock.code.delay)
      })
    } else {
      return callMock({ mock, params, provider })
    }
  } else {
    raise(
      'Web3Mock: Please mock the request: ' +
      JSON.stringify({
        blockchain,
        code: getCallToBeMock({ mock, params, provider }),
      })
    )
  }
}

let getCallToBeMock = ({ mock, params, provider }) => {

  let toBeMocked = {
    for: params.address,
    return: 'Your Value',
  }

  return toBeMocked
}

export { code }
