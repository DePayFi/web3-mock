import { on } from "./on"

let mock = ({ configuration, window }) => {

  if(typeof configuration?.connector == 'undefined') { throw('You need to pass a WalletConnect connector instance when mocking WalletConnect!') }

  configuration.connector.createSession = function(){ }
  
  configuration.connector.sendCustomRequest = async function(options){
    return await window.ethereum.request(options)
  }

  configuration.connector.connect = async function(){
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    let chainId = await window.ethereum.request({ method: 'net_version' })

    return {
      accounts,
      chainId
    }
  }
  
  configuration.connector.on = on
}

export {
  mock
}
