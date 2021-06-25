Simplify testing your dApps by mocking blockchain providers and wallets with Web3Mock.

## Quickstart

```
yarn add depay-web3mock
```

or 

```
npm install --save depay-web3mock
```

### Basic

```javascript
import { mock } from '../../../src'

describe('something', ()=> {

  beforeEach(()=>mock('ethereum'))

  it('does something', ()=>{

    await window.ethereum.request(method: 'eth_chainId') // '0x1'
    await window.ethereum.request(method: 'net_version') // 1
    await window.ethereum.request(method: 'eth_getBalance') // '0x0'
    await window.ethereum.request(method: 'eth_accounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]
    await window.ethereum.request(method: 'eth_requestAccounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]

  })
})
```

### Advanced

```javascript
import { mock, resetMocks } from 'depay-web3mock'

describe('something', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks contract calls', ()=>{
    
    let tokenMock = mock({
      blockchain: 'ethereum',
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
        abi: TokenAbi,
        name: "DePay",
        symbol: "DEPAY",
        balanceOf: {
          "0x5Af489c8786A018EC4814194dC8048be1007e390": "1000000000000000000"
        }
      }
    })

    await token.name() // DePay
    await token.symbol() // DEPAY
    await token.balanceOf("0x5Af489c8786A018EC4814194dC8048be1007e390") // "1000000000000000000"

    expect(tokenMock).toHaveBeenCalled()
    expect(tokenMock).toHaveBeenCalledTimes(3)
  })

  it('mocks transactions', ()=>{
    
    let mockedTransaction = mock({
      blockchain: 'ethereum',
      transaction: {
        to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
        from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        value: "2000000000000000000"
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let signer = provider.getSigner();

    let transaction = await signer.sendTransaction({
      to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
      value: ethers.utils.parseEther("2")
    })

    expect(transaction).toBeDefined()
    expect(mockedTransaction).toHaveBeenCalled()
  })

  it('mocks contract transactions', ()=>{
    
    let transactionMock = mock({
      blockchain: 'ethereum',
      transaction: {
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        abi: DePayRouterV1Abi,
        method: 'route',
        params: {
          path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          amounts: ["773002376389189", "1000000000000000000", "3623748721"]
        }
      }
    }}

    await DePayRouterV1Contract().connect(signer).route(
      path,
      [amountIn, amountOut, deadline],
      [receiver],
      plugins,
      [],
      { value: value }
    )

    expect(transactionMock).toHaveBeenCalled()
  })
```

## Functionalities

### Basic Implicit Mocks

Mocks basic blockchain functionalities without explicit configuration:

```javascript
mock('ethereum')

await window.ethereum.request(method: 'eth_chainId') // '0x1'
await window.ethereum.request(method: 'net_version') // 1
await window.ethereum.request(method: 'eth_getBalance') // '0x0'
await window.ethereum.request(method: 'eth_accounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]
await window.ethereum.request(method: 'eth_requestAccounts') // ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]
await window.ethereum.request(method: 'eth_estimateGas') // '0x2c4a0'
await window.ethereum.request(method: 'eth_blockNumber') // '0x5daf3b'
```

### Contract Calls

#### Mock Simple Contract Calls

```javascript
let callMock = mock({
  blockchain: 'ethereum',
  address: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
  abi: abi,
  call: {
    name: 'DePay'
  }
})

let contract = new ethers.Contract(
  '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
  abi,
  provider
);

expect(await contract.name()).toEqual('DePay')
expect(callMock).toHaveBeenCalled()
```

#### Mock Simple Contract Calls with Parameters

```javascript
mock({
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
  abi: abi,
  call: {
    balanceOf: {
      "0x5Af489c8786A018EC4814194dC8048be1007e390": "1000000000000000000"
    }
  }
})

provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
  abi,
  provider
);

expect(
  (await contract.balanceOf("0x5Af489c8786A018EC4814194dC8048be1007e390")).toString()
).toEqual("1000000000000000000")
```

#### Mock Complex Contract Calls with Complex Parameters

```javascript
let contractMock = mock({
  blockchain: 'ethereum',
  abi: abi,
  address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
  call: {
    getAmountsIn: {
      [
        ["1000000000000000000", ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]]
      ]: ["773002376389189", "1000000000000000000"]
    }
  }
})

provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
  abi,
  provider
);

expect(
  (await contract.getAmountsIn(
    "1000000000000000000",
    ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]
  )).map((bigNumber)=>bigNumber.toString())
).toEqual(["773002376389189", "1000000000000000000"])

expect(contractMock).toHaveBeenCalled()
```

### Transactions

`Web3Mock` does not implicitly mock transactions.
You need to mock the transactions before they are executed.

`Web3Mock` mocks `eth_sendTransaction`, `eth_getTransactionByHash`, `eth_getTransactionReceipt` request to cover the full lifecycle of blockchain transactions.

#### Mock Simple Transactions

```javascript
let mockedTransaction = mock({
  blockchain: 'ethereum',
  transaction: {
    to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
    from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    value: "2000000000000000000"
  }
})

let provider = new ethers.providers.Web3Provider(global.ethereum);

let signer = provider.getSigner();

let transaction = await signer.sendTransaction({
  to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
  value: ethers.utils.parseEther("2")
})

expect(transaction).toBeDefined()

expect(mockedTransaction).toHaveBeenCalled()
````

#### Mock Complex Contract Transactions

```javascript
let mockedTransaction = mock({
  blockchain: 'ethereum',
  transaction: {
    from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
    abi: abi,
    method: 'route',
    params: {
      path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
      amounts: ["773002376389189", "1000000000000000000", "3623748721"]
    }
  }
})

let provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
  abi,
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

expect(transaction).toBeDefined()

expect(mockedTransaction).toHaveBeenCalled()
````

#### Mock transaction confirmations

Mocking transaction confirmations consists of two steps:

1. Confirming the mocked transaction once
2. Increase the blocknumber after the transaction has been confirmed (to increase transaction confirmation amount)

```javascript
import { mock, confirm } from 'depay-web3mock'

let mockedTransaction = mock({
  blockchain: 'ethereum',
  transaction: {
    to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
    value: '1000000000000000000'
  }
})

confirm(mockedTransaction)

await sentTransaction.wait(1).then(function(receipt){
  //... will be executed once confirm is called
})
```

```javascript
import { mock, confirm, increaseBlock } from 'depay-web3mock'

let mockedTransaction = mock({
  blockchain: 'ethereum',
  transaction: {
    to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
    value: '1000000000000000000'
  }
})

confirm(mockedTransaction)
increaseBlock(12)

await sentTransaction.wait(12).then(function(receipt){
  //... will be executed once increaseBlock(12) has been called
})
```

### Mock Events

`Web3Mock` allows you to trigger events (like `accountsChanged`).

```javascript
import { mock, trigger } from 'depay-web3mock'

mock('ethereum')

// some other prep and test code

trigger('accountsChanged', ['0xb0252f13850a4823706607524de0b146820F2240', '0xEcA533Ef096f191A35DE76aa4580FA3A722724bE'])
```

### Mock for specific providers

If you want to mock Web3 calls and transactions for other providers but the usual, implicit ones (like window.ethereum),
you can pass them explicitly to `Web3Mock`:

```javascript

let provider = new ethers.providers.JsonRpcProvider('https://example.com');
    
mock({
  provider,
  blockchain: 'ethereum'
  // ...
})
```

### window

Pass a window object in case it is not supposed to be the implicit `window`.

```javascript
mock({
  window: anotherObject,
  blockchain: 'ethereum'
  // ...
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

#### Jest

In your jest test environment `global` is `window`
so `Web3Mock` takes jest's `global` automatically when using `Web3Mock` in a jest test environment.
