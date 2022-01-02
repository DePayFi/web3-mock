import { on, off } from "./events"
import { setWalletConnectClass } from "../../mocks"

let mock = ({ configuration, window }) => {

  if(typeof configuration?.connector == 'undefined') { throw('You need to pass a WalletConnect connector instance when mocking WalletConnect!') }
  if(configuration.connector.instance){ return configuration.connector.instance }

  setWalletConnectClass(configuration.connector)
  let instance = configuration.connector.instance = new configuration.connector()

  instance.createSession = function(){ }
  
  instance.sendCustomRequest = async function(options){
    return await window.ethereum.request(options)
  }

  instance.connect = async function(){
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    let chainId = await window.ethereum.request({ method: 'net_version' })

    return {
      accounts,
      chainId
    }
  }
  
  instance.on = on
  
  instance.off = off

  instance.sendTransaction = async function(transaction){
    return await window.ethereum.request({ method: 'eth_sendTransaction', params: [transaction] })
  }

  instance.signPersonalMessage = async function(params){
    return await window.ethereum.request({ method: 'eth_sign', params: [params[1], params[0]] })
  }
}

export {
  mock
}
