import { connect } from './connect'
import { request } from './request'
import { setCurrentNetwork } from '../../network'

let mock = ({ blockchain, configuration, window, provider }) => {

  setCurrentNetwork(blockchain)

  window.solana = {
    ...window.solana,
    connect: ()=>{
      return connect({
        blockchain, provider
      })
    },
    request: (payload) => {
      return request({
        request: payload,
      })
    },
  }

  return configuration
}

export { mock }
