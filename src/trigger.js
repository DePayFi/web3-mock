import { triggerEvent as triggerEVMEvent } from './vms/evm/on'
import { triggerEvent as triggerWalletConnectEvent } from './wallets/walletConnect/on'
import { mocks } from './mocks'

export default (eventName, value) => {
  triggerEVMEvent(eventName, value)
  triggerWalletConnectEvent(eventName, value)
}
