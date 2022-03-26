import { Blockchain } from "@depay/web3-blockchains"
import { on, removeListener } from "./events"
import { setWalletLinkClass } from "../../mocks"

let mock = ({ configuration, window }) => {

  if(typeof configuration?.connector == 'undefined') { throw('You need to pass a WalletLink connector instance when mocking WalletLink!') }
  if(configuration.connector.instance){ return configuration.connector.instance }

  setWalletLinkClass(configuration.connector)
  let instance = configuration.connector.instance = new configuration.connector()

  instance.enable = async function(){
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    return accounts
  }

  instance._relayProvider = async function() {
    return {
      setConnectDisabled: ()=>{}
    }
  }

  instance.getChainId = async function() {
    const blockchain = Blockchain.findById(await window.ethereum.request({ method: 'eth_chainId' }))
    return blockchain.networkId
  }

  instance.request = window.ethereum.request
  
  instance.on = on
  instance.removeListener = removeListener
}

export {
  mock
}
