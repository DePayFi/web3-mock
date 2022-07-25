import { triggerEvent as triggerEVMEvent } from './platforms/evm/events'
import { triggerEvent as triggerSolanaEvent } from './platforms/solana/events'
import { triggerEvent as triggerWalletConnectEvent } from './wallets/walletConnect/events'
import { triggerEvent as triggerWalletLinkEvent } from './wallets/walletLink/events'
import { mocks } from './mocks'

export default (eventName, value) => {
  triggerEVMEvent(eventName, value)
  triggerSolanaEvent(eventName, value)
  triggerWalletConnectEvent(eventName, value)
  triggerWalletLinkEvent(eventName, value)
}
