import { Ethereum } from './blockchains'
import mocks from './mocks'

let getWindow = (configuration)=> {
  if(configuration.window) return configuration.window;
  if(typeof global == 'object') return global;
  if(typeof window == 'object') return window;
}

let getBlockchain = (configuration)=> {
  if (typeof configuration === 'string') {
    return configuration
  } else if (typeof configuration === 'object' && Object.keys(configuration)[0]) {
    return Object.keys(configuration)[0]
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

export default (configuration)=> {
  preflight(configuration);

  let window = getWindow(configuration);
  let blockchain = getBlockchain(configuration);
  let provider = configuration.provider;

  switch (blockchain) {
    case 'ethereum':
      mocks.push(Ethereum({ configuration: configuration['ethereum'], window, provider }))
      break
    default:
      throw 'Web3Mock: Unknown blockchain!'
  }
}
