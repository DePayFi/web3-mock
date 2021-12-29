import { triggerEvent as triggerEVMEvent } from './vms/evm/events'
import { triggerEvent as triggerWalletConnectEvent } from './wallets/walletConnect/events'
import { mocks } from './mocks'

export default (eventName, value) => {
  triggerEVMEvent(eventName, value)
  triggerWalletConnectEvent(eventName, value)
}
