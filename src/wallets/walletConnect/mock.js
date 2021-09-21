import Connector from "@walletconnect/core"
import { on } from "./on"

let mock = ({ window }) => {
  Connector.prototype.createSession = function(){ }
  Connector.prototype.connect = async function(){
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    let chainId = await window.ethereum.request({ method: 'net_version' })

    return {
      accounts,
      chainId
    }
  }
  Connector.prototype.on = on
}

export {
  mock
}
