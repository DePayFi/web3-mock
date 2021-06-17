// https://docs.metamask.io/guide/ethereum-provider.html

import { ethers } from 'ethers'
import { mockCalls } from './request/call'
import { mockTransactions } from './request/transactions'
import { on, resetEvents, triggerEvent } from './on'
import { request } from './request'

let Ethereum = ({ configuration, window }) => {
  mockCalls(configuration?.calls)
  mockTransactions(configuration?.transactions)
  resetEvents()

  window.ethereum = {
    ...window.ethereum,
    on,
    request: (configuration) => request({ request: configuration, window }),
  }

  return Ethereum
}

Ethereum.trigger = triggerEvent

export default Ethereum
