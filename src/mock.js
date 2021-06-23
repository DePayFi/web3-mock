import { mock as mockEthereum } from './blockchains/ethereum'
import { mocks } from './mocks'

let getWindow = (configuration)=> {
  if(configuration.window) return configuration.window;
  if(typeof global == 'object') return global;
  if(typeof window == 'object') return window;
}

let getBlockchain = (configuration)=> {
  if (typeof configuration === 'string') {
    return configuration
  } else if (typeof configuration === 'object') {
    return configuration.blockchain
  } else {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
}

let preflight = (configuration)=> {
  if (configuration === undefined || configuration.length === 0) {
    throw 'Web3Mock: No mock defined!'
  } else if (typeof configuration === 'object' && Object.keys(configuration).length === 0) {
    throw 'Web3Mock: Mock configuration is empty!'
  } else if (typeof configuration != 'string' && typeof configuration != 'object') {
    throw 'Web3Mock: Unknown mock configuration type!'
  }
}

export default (configuration, call)=> {
  preflight(configuration);

  let window = getWindow(configuration);
  let blockchain = getBlockchain(configuration);
  let provider = configuration.provider;
  let mock;

  switch (blockchain) {
    case 'ethereum':
      mock = mockEthereum({ configuration: configuration, window, provider })
      mocks.push(mock)
      break
    default:
      throw 'Web3Mock: Unknown blockchain!'
  }

  return mock;
}
