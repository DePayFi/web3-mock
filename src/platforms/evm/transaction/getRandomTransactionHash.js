import { ethers } from 'ethers'

export default () => {
  return ethers.BigNumber.from(
    '1' +
      Array(76)
        .fill()
        .map(() => Math.random().toString()[4])
        .join(''),
  )._hex
}
