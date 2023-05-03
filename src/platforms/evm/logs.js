import raise from '../../raise'
import { findMock } from './findMock'

const getLogs = ({ blockchain, params, provider })=> {

  let mock = findMock({ type: 'logs', blockchain, params, provider })

  if(mock && mock?.logs?.return) {
    return Promise.resolve(mock.logs.return)
  } else {
    raise(
      'Web3Mock: Please mock the logs request: ' +
      JSON.stringify({
        blockchain,
        logs: getLogsToBeMocked({ params, provider }),
      })
    )
  }
}

const getLogsToBeMocked = ({ params, provider }) => {

  return {
    address: params.address,
    topics: params.topics,
    fromBlock: params.fromBlock,
    toBlock: params.toBlock,
    return: ['THE_RETURNED_LOGS']
  }
}

export {
  getLogs
}
