// https://docs.metamask.io/guide/ethereum-provider.html

import { ethers } from 'ethers'
import { mockCalls } from './request/call'
import { mockTransactions } from './request/transactions'
import { request } from './request'

export default ({ configuration, window }) => {

  mockCalls(configuration?.calls)
  mockTransactions(configuration?.transactions)

  window.ethereum = { 
    ...window.ethereum,
    request: (configuration)=>request({ request: configuration, window })
  }
}
