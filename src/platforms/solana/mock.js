import { connect } from './connect'
import { on, removeListener } from './events'
import { request as providerRequest } from './provider'
import { request as walletRequest } from './wallet'
import { setCurrentNetwork } from '../../network'
import { signAndSendTransaction, getSignatureStatus } from './transaction'

let mock = ({ blockchain, configuration, window, provider }) => {

  setCurrentNetwork(blockchain)

  if(provider) {
    provider._rpcRequest = (method, params)=>{
      return providerRequest({ blockchain, provider, method, params })
    }
    provider.signAndSendTransaction = async (transaction)=>signAndSendTransaction({ blockchain, params: transaction, provider })
    provider.getSignatureStatus = async (signature)=>getSignatureStatus({ blockchain, signature, provider })
    provider.on = on
    provider.removeListener = removeListener
  }

  window.solana = {
    ...window.solana,
    connect: ()=>{
      return connect({
        blockchain, provider
      })
    },
    on,
    removeListener,
    request: (payload) => {
      return walletRequest({
        request: payload,
      })
    },
    signAndSendTransaction: async (transaction)=>signAndSendTransaction({ blockchain, params: transaction, provider }),
    getSignatureStatus: async (signature)=>getSignatureStatus({ blockchain, signature, provider })
  }

  return configuration
}

export { mock }
