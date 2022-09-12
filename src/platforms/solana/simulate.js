import { findMock } from './findMock'

let simulateTransaction = ({ blockchain, params, provider }) => {
  let mock = findMock({ type: 'simulate', params, provider })

  return({
    jsonrpc: '2.0',
    id: '1', 
    result: {
      context:{ apiVersion: '1.10.26', slot: 140152926 }, 
      value: mock._return
    } 
  })
}

export {
  simulateTransaction
}
