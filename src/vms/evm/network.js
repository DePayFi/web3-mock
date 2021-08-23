import raise from '../../raise'
import { Blockchain } from 'depay-web3-blockchains'
import { findMock } from './findMock'
import { setCurrentNetwork } from '../../network'

let switchNetwork = function ({ blockchain, id, provider }) {
  let toBlockchain = Blockchain.findById(id)
  if(toBlockchain == undefined) { throw `No blockchain found for id ${id}` }
  let params = { switchTo: toBlockchain.name }

  let mock = findMock({ type: 'network', params, provider })
  
  if (mock && mock.network?.switchTo) {
    mock.calls.add(params)
    if(mock.network.error) {
      if(typeof mock.network.error == 'function') {
        return Promise.reject(mock.network.error())
      } else {
        return Promise.reject(mock.network.error)
      }
    } else {
      setCurrentNetwork(toBlockchain.name)
      return Promise.resolve()
    }
  } else {
    raise(
      'Web3Mock: Please mock the network switch: ' +
      JSON.stringify({
        blockchain,
        network: {
          switchTo: toBlockchain.name
        },
      })
    )
  }
}

let addNetwork = function ({ blockchain, params, provider }) {
  let mock = findMock({ type: 'network', params: { add: params }, provider })
  
  if (mock && mock.network?.add) {
    mock.calls.add(params)
    return Promise.resolve()
  } else {
    raise(
      'Web3Mock: Please mock the network addition: ' +
      JSON.stringify({
        blockchain,
        network: {
          add: params
        },
      })
    )
  }
}

export {
  switchNetwork,
  addNetwork
}
