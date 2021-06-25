let currentBlock = 1

let getCurrentBlock = () => currentBlock

let increaseBlock = (amount = 1) => {
  currentBlock += amount
}

export { getCurrentBlock, increaseBlock }
