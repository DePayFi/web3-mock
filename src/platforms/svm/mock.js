import { connect } from './connect'
import { getLatestBlockhash } from './blockHash'
import { on, removeListener } from './events'
import { request as providerRequest } from './provider'
import { request as walletRequest } from './wallet'
import { setCurrentNetwork } from '../../network'
import { sign } from './sign'
import { signAndSendTransaction, getSignatureStatus, getConfirmedTransaction } from './transaction'
import { simulateTransaction } from './simulate'

let mock = ({ blockchain, configuration, window, provider }) => {

  setCurrentNetwork(blockchain)

  if(provider) {
    provider.on = on
    provider.removeListener = removeListener
    provider._rpcRequest = (method, params)=>{
      return providerRequest({ blockchain, provider, method, params })
    }
    provider.getLatestBlockhash = ()=>getLatestBlockhash({ blockchain })
    provider.signAndSendTransaction = async (transaction)=>signAndSendTransaction({ blockchain, params: transaction, provider })
    provider.simulateTransaction = async (transaction)=>simulateTransaction({ blockchain, params: transaction, provider })
    provider.getSignatureStatus = async (signature)=>getSignatureStatus({ blockchain, signature, provider })
    provider.getConfirmedTransaction = async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider })
    provider.getTransaction = async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider })
  }

  window._solana = {
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
    getLatestBlockhash: ()=>getLatestBlockhash({ blockchain }),
    signAndSendTransaction: async (transaction)=>signAndSendTransaction({ blockchain, params: transaction, provider }),
    getSignatureStatus: async (signature)=>getSignatureStatus({ blockchain, signature, provider }),
    simulateTransaction: async (transaction)=>simulateTransaction({ blockchain, params: transaction, provider }),
    getConfirmedTransaction: async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider }),
    getTransaction: async (signature, params)=>getConfirmedTransaction({ blockchain, signature, params, provider }),
    signMessage: (message)=>sign({ blockchain, params: [message], provider }).then((signature)=>{ return { signature } }),
  }

  return configuration
}

export { mock }
