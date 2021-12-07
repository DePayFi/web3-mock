let currentBlock

let getCurrentBlock = () => currentBlock

let resetCurrentBlock = ()=>{
  currentBlock = 1
}

resetCurrentBlock()

let increaseBlock = (amount = 1) => {
  currentBlock += amount
}

export { resetCurrentBlock, getCurrentBlock, increaseBlock }
