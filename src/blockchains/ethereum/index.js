// https://docs.metamask.io/guide/ethereum-provider.html

import on from './on'
import request from './request'
import { ethers } from 'ethers'

export default ({ chain = 1, window = window }) => {
  window.ethereum = { ...window.ethereum, request: request, on: on }
}
