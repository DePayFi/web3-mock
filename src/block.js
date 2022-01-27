let currentBlock

let blockData = {}

let getCurrentBlock = () => currentBlock

let resetCurrentBlock = ()=>{
  currentBlock = 1
}

resetCurrentBlock()

let increaseBlock = (amount = 1) => {
  currentBlock += amount
}

let getBlockData = (number) => {
  return(blockData[number] || {})
}

let setBlockData = (number, data) => {
  blockData[number] = data
}

let resetBlockData = ()=> {
  blockData = {}
}

export { resetCurrentBlock, getCurrentBlock, increaseBlock, getBlockData, setBlockData, resetBlockData }
