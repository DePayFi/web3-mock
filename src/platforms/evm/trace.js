import raise from '../../raise'
import { findMock } from './findMock'

const traceTransaction = ({ blockchain, params, provider })=> {

  let mock = findMock({ type: 'trace', blockchain, params, provider })

  if(mock && mock?.trace?.return) {
    return Promise.resolve(mock.trace.return)
  } else {
    raise(
      'Web3Mock: Please mock the trace request: ' +
      JSON.stringify({
        blockchain,
        trace: getTraceToBeMocked({ params, provider }),
      })
    )
  }
}

const getTraceToBeMocked = ({ params, provider }) => {

  return {
    params: params,
    return: 'YOUR_TRACE_OBJECT'
  }
}

export {
  traceTransaction
}
