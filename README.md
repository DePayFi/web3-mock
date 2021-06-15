Simplify testing your dApps by mocking blockchain providers and wallets with Web3Mock.

## Quickstart

```
yarn add depay-web3mock
```

or 

```
npm install --save depay-web3mock
```

### Simple

```javascript
import { Web3Mock } from 'depay-web3mock'

Web3Mock({ mocks: 'ethereum' })

await window.ethereum.request(method: 'eth_chainId') // '0x1'
await window.ethereum.request(method: 'net_version') // 1
await window.ethereum.request(method: 'eth_getBalance') // '0x0'
await window.ethereum.request(method: 'eth_accounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]
await window.ethereum.request(method: 'eth_requestAccounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]

let provider = new ethers.providers.Web3Provider(window.ethereum);
let signer = provider.getSigner();

await signer.sendTransaction({
  to: "vitalik.eth",
  value: ethers.utils.parseEther("1")
});
//

await DePayRouterV1Contract().connect(signer).route(
  path,
  [amountIn, amountOut, deadline],
  [receiver],
  plugins,
  [],
  { value: value }
)
//
```

### Complex

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
      },
      transactions: {
        "0x5Af489c8786A018EC4814194dC8048be1007e390": {
          value: "1000000000000000000"
        },
        "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92": {
          abi: DePayRouterV1Abi,
          method: 'route',
          params: {
            path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
            amounts: ["773002376389189", "1000000000000000000", "3623748721"]
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
await window.ethereum.request(method: 'eth_accounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]
await window.ethereum.request(method: 'eth_requestAccounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]
await window.ethereum.request(method: 'eth_estimateGas') // '0x2c4a0'
await window.ethereum.request(method: 'eth_blockNumber') // '0x5daf3b'
```

### Explicit Mocks

#### Contract Calls

##### Mock Simple Contract Calls

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

##### Mock Simple Contract Calls with Parameters

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

##### Mock Complex Contract Calls with Complex Parameters

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

`Web3Mock` mocks all transactions per default (without adding explicit mocking).

```javascript
WebMock({ mocks: 'ethereum' })
```

`Web3Mock` mocks `eth_sendTransaction`, `eth_getTransactionByHash`, `eth_getTransactionReceipt` request to cover the full lifecycle of blockchain transactions.

Once you set the `transactions` key in the mock configuration, all transactions are required to be mocked:

```javascript
WebMock({
  mocks: {
    ethereum: {
      transactions: {}
    }
  }
})

signer.sendTransaction({
  to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
  value: ethers.utils.parseEther("1")
})
// raises: Web3Mock Ethereum transactions: Please mock the transaction: { \"0xd8da6bf26964af9d7eed9e03e53415d37aa96045\": { \"to\": \"0x5af489c8786a018ec4814194dc8048be1007e390\" , \"value\": \"1000000000000000000\"}
```

##### Mock Simple Transactions

```javascript
WebMock({
  mocks: {
    ethereum: {
      transactions: {
        "0x5Af489c8786A018EC4814194dC8048be1007e390": { // to address
          value: "1000000000000000000"
        }
      }
    }
  }
})

signer.sendTransaction({
  to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
  value: ethers.utils.parseEther("1")
})
````

##### Mock Complex Contract Transactions

```javascript
WebMock({
  mocks: {
    ethereum: {
      transactions: {
        '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92': {
          from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          abi: DePayRouterV1Abi,
          method: 'route',
          params: {
            path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
            amounts: ["773002376389189", "1000000000000000000", "3623748721"]
          }
        }
      }
    }
  }
})

let provider = new ethers.providers.Web3Provider(window.ethereum);

let contract = new ethers.Contract(
  "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
  [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
  provider
);

let signer = provider.getSigner();

let transaction = await contract.connect(signer).route(
  ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
  ["773002376389189", "1000000000000000000", "3623748721"],
  [],
  [],
  [],
  { value: 0 }
)
````

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

