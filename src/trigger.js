import { triggerEvent as triggerEthereumEvent } from './blockchains/ethereum/on'
import { mocks } from './mocks'

export default (eventName, value) => {
  triggerEthereumEvent(eventName, value);
}
