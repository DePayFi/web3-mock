## Quickstart

```
yarn add depay-web3mock
```

or 

```
npm install --save depay-web3mock
```

```javascript
import { Web3Mock } from 'depay-web3mock'

Web3Mock({
  mocks: {
    ethereum: {
      calls: {
        "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb": {
          abi: TokenAbi,
          name: "DePay",
          symbol: "DEPAY",
          balanceOf: {
            "0x5Af489c8786A018EC4814194dC8048be1007e390": "1000000000000000000"
          }
        },
        "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": {
          abi: UniswapV2RouterAbi,
          getAmountsIn: {
            [
              ["1000000000000000000", ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]]
            ]: ["773002376389189", "1000000000000000000"]
          }
        }
      }
    }
  }
})

await contract.name() // DePay
await contract.symbol() // DEPAY
await contract.balanceOf("0x5Af489c8786A018EC4814194dC8048be1007e390") // "1000000000000000000"

await uniswapV2RouterInstance.getAmountsIn("1000000000000000000", ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"])
// ["773002376389189", "1000000000000000000"]
```

## Functionalities

### Basic Mocks

Mocks basic blockchain functionalities without explicit mocking:

```javascript
Web3Mock({
  mocks: ['ethereum']
})

await window.ethereum.request(method: 'eth_chainId') // '0x1'
await window.ethereum.request(method: 'net_version') // 1
await window.ethereum.request(method: 'eth_getBalance') // '0x0'
await window.ethereum.request(method: 'eth_accounts') // []
await window.ethereum.request(method: 'eth_requestAccounts') // []
await window.ethereum.request(method: 'eth_estimateGas') // '0x2c4a0'
await window.ethereum.request(method: 'eth_blockNumber') // '0x5daf3b'
```

### Advanced Mocks

#### Contract Calls

##### Simple calls

```javascript
Web3Mock({
  mocks: {
    ethereum: {
      calls: {
        "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb": {
          abi: abi,
          name: "DePay",
          symbol: "DEPAY"
        }
      }
    }
  }
})
```

##### Calls and mocks for simple parameters

```javascript
Web3Mock({
  mocks: {
    ethereum: {
      calls: {
        "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb": {
          abi: abi,
          balanceOf: {
            "0x5Af489c8786A018EC4814194dC8048be1007e390": "1000000000000000000"              
          }
        }
      }
    }
  }
})
```

##### Calls and mocks for complex parameters

```javascript
Web3Mock({
  mocks: {
    ethereum: {
      calls: {
        "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": {
          abi: UniswapV2RouterAbi,
          getAmountsIn: {
            [
              ["1000000000000000000", ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]]
            ]: ["773002376389189", "1000000000000000000"]
          }
        }
      }
    }
  }
})
```

#### Transactions

### window

Pass a window object in case it is not supposed to be the implicit `window`.

```javascript
Web3Mock({
  window: anotherObject,
  mocks: ['ethereum']
})
```

## Development

### Get started

```
yarn install
yarn test
```

### Release

```
npm publish
```

### Testing

