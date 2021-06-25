import { increaseBlock as increaseEthereumBlock } from './blockchains/ethereum/block'

let increaseBlock = (amount) => {
  increaseEthereumBlock(amount)
}

export { increaseBlock }
