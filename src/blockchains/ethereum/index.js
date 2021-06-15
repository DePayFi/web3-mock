// https://docs.metamask.io/guide/ethereum-provider.html

import { request, mockCalls } from './request'
import { ethers } from 'ethers'

export default ({ configuration, window }) => {

  mockCalls(configuration?.calls)

  window.ethereum = { 
    ...window.ethereum,
    request: (configuration)=>request({ request: configuration, window })
  }
}
