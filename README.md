Simplify testing your dApps by mocking blockchain providers and wallets with web3-mock.

## Quickstart

```
yarn add @depay/web3-mock --dev
```

or 

```
npm install --save-dev @depay/web3-mock
```

Make sure you setup [Jest](https://github.com/DePayFi/web3-mock#jest), [Cypress](https://github.com/DePayFi/web3-mock#cypress) or [Playwright](https://github.com/DePayFi/web3-mock#playwright) correctly before start using web3-mock.

### Basics

#### EVM: Basics

```javascript
import { mock } from '@depay/web3-mock'

describe('something', ()=> {

  beforeEach(()=>mock('ethereum'))

  it('does something', ()=>{

    await window.ethereum.request(method: 'eth_chainId') // '0x1'
    await window.ethereum.request(method: 'net_version') // 1

  })
})
```

#### Solana: Basics

Requires explicit provider mocking (see [Providers](#Providers))

```javascript

let connection = new Connection('https://api.mainnet-beta.solana.com')
mock({ blockchain: 'solana', provider: connection })

let block = connection.getBlockHeight()
block // 1

let blockHash = connection.getLatestBlockhash()
blockHash // { blockhash: "6ErPTEaPmVUwEPeX4MAiCEEC7fJ254zCdq6M294JozDx", lastValidBlockHeight: 123 }
```

### Advanced

#### EVM: Advanced

```javascript
import { mock, resetMocks } from '@depay/web3-mock'

describe('something', ()=> {

  let blockchain = 'ethereum'
  let accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  beforeEach(resetMocks)
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

  it('mocks requests', ()=>{

    let balanceOfMock = mock({
      blockchain,
      request: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
        method: 'balanceOf',
        params: "0x5Af489c8786A018EC4814194dC8048be1007e390",
        return: "1000000000000000000"
      }
    })

    await token.balanceOf("0x5Af489c8786A018EC4814194dC8048be1007e390") // "1000000000000000000"

    expect(balanceOfMock).toHaveBeenCalled()
    expect(balanceOfMock).toHaveBeenCalledTimes(1)
  })

  it('mocks transactions', ()=>{
    
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
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
      blockchain,
      transaction: {
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        api: [[{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]],
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

#### Solana: Advanced

```javascript
import { mock, resetMocks } from '@depay/web3-mock'

describe('something', ()=> {

  let blockchain = 'solana'
  let accounts = ['5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa']
  beforeEach(resetMocks)
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

  it('mocks balance requests', ()=>{

    let connection = new Connection('https://api.mainnet-beta.solana.com')

    let balanceMock = mock({
      provider: connection,
      blockchain,
      balance: {
        for: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
        return: 232111122321
      }
    })

    let balance = await connection.getBalance(new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'))

    expect(balance).toEqual(232111122321)
    expect(balanceMock).toHaveBeenCalled()
  })

  it('mocks simple transactions', ()=>{
    
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
        instructions:[{
          to: '11111111111111111111111111111111',
          api: struct([
            u32('instruction'),
            u64('lamports')
          ])
        }]
      }
    })

    let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
    let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

    let transaction = new Transaction({
      recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
      feePayer: fromPubkey
    })

    transaction.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: 1000000000
      })
    )
    
    let signedTransaction = await window.solana.signAndSendTransaction(transaction)

    expect(signedTransaction).toBeDefined()
    expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
    expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

    expect(mockedTransaction).toHaveBeenCalled()
  })

  it('mocks complex transactions', ()=>{
    
   
  })
```

## Support

This library supports the following blockchains:

- [Ethereum](https://ethereum.org)
- [BNB Smart Chain](https://www.binance.org/smartChain)
- [Polygon](https://polygon.technology)
- [Solana](https://solana.com)
- [Fantom](https://fantom.foundation)
- [Velas](https://velas.com)

This library supports the all crypto wallets that inject window.ethereum or window.solana like:

- [MetaMask](https://metamask.io)
- [Coinbase Wallet](https://wallet.coinbase.com)
- [Phantom](https://phantom.app/)

100+ different wallets via [WalletConnect](https://walletconnect.org), such as:

## Platform specific packaging

In case you want to use and package only specific platforms, use platform specific packages:

### EVM platform specific package

```javascript
import { mock } from '@depay/web3-mock-evm'
```

### Solana platform specific package

```javascript
import { mock } from '@depay/web3-mock-solana'
```

## Functionalities

### Basic Implicit Mocks

#### EVM: Basic Implicit Mocks

```javascript
mock('ethereum')

await window.ethereum.request({ method: 'eth_chainId' }) // '0x1'
await window.ethereum.request({ method: 'net_version' }) // 1
await window.ethereum.request({ method: 'eth_getBalance' }) // '0x0'
await window.ethereum.request({ method: 'eth_estimateGas' }) // '0x2c4a0'
await window.ethereum.request({ method: 'eth_blockNumber' }) // '0x5daf3b'
await window.ethereum.request({ method: 'eth_subscribe' }) // undefined
```

#### Solana: Basic Implicit Mocks

```javascript
// requires explicit provider mocking (see #Providers)

let connection = new Connection('https://api.mainnet-beta.solana.com')
mock({ blockchain: 'solana', provider: connection })

let block = connection.getBlockHeight()
block // 1
```

### Accounts

Mocks accounts and wallet connect processes:

```javascript
mock({
  blockchain,
  accounts: {
    return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  }
})
```

Also allows you to test a "connect wallet screen" by delaying the mock:

```javascript
mock({
  blockchain,
  accounts: {
    delay: 10000, // ms
    return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  }
})
// will wait 10s before returning with the address (emulating user granting access to the wallet)
```

Also allows you to test a "connection failed" by returning an error:

```javascript
mock({
  blockchain,
  accounts: {
    return: Error('User rejected the request.')
  }
})
```

### Request Data

You need to mock requests before they are executed.

#### Simple Requests

##### EVM: Simple Requests

```javascript
let requestMock = mock({
  blockchain: 'ethereum',
  request: {
    to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    api: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
    method: 'name',
    return: 'DePay'
  }
})

let contract = new ethers.Contract(
  '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
  provider
);

expect(await contract.name()).toEqual('DePay')
expect(requestMock).toHaveBeenCalled()
```

##### Solana: Simple Requests

```javascript
import { Connection, PublicKey, struct, publicKey, u64, u32, u8 } from '@depay/solana-web3.js'

let api = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
])

let connection = new Connection('https://api.mainnet-beta.solana.com')

let requestMock = mock({
  provider: connection,
  blockchain,
  request: {
    method: 'getAccountInfo',
    to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
    api,
    return: {
      mint: '8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r',
      owner: 'Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX',
      amount: '2511210038936013080',
      delegateOption: 70962703,
      delegate: 'BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR',
      state: 0,
      isNativeOption: 0,
      isNative: '0',
      delegatedAmount: '0',
      closeAuthorityOption: 0,
      closeAuthority: '11111111111111111111111111111111'
    }
  }
})

let info = await connection.getAccountInfo(new PublicKey('2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'))

expect(requestMock).toHaveBeenCalled()

const decoded = api.decode(info.data)
decoded.mint.toString() // 8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r
```

#### Simple Request with Parameters

```javascript
mock({
  blockchain: 'ethereum',
  request: {
    to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
    api: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
    method: 'balanceOf',
    params: '0x5Af489c8786A018EC4814194dC8048be1007e390',
    return: "1000000000000000000"
  }
})

provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
  provider
);

expect(
  (await contract.balanceOf("0x5Af489c8786A018EC4814194dC8048be1007e390")).toString()
).toEqual("1000000000000000000")
```

#### Requests for Specific Given Block

EVM only:

##### EVM: Requests for Specific Given Block

```javascript
mock({
  blockchain: 'ethereum',
  block: 14904791,
  request: {
    to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
    api: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
    method: 'balanceOf',
    params: '0x5Af489c8786A018EC4814194dC8048be1007e390',
    return: "1000000000000000000"
  }
})

provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
  provider
);

await contract.balanceOf("0x5Af489c8786A018EC4814194dC8048be1007e390", { blockTag: 'latest' }) 
// raises Web3Mock: Please mock the request 

await contract.balanceOf("0x5Af489c8786A018EC4814194dC8048be1007e390", { blockTag: 14904791 }) 
// 1000000000000000000
```

#### Complex Requests with Parameters

##### EVM: Complex Requests with Parameters

```javascript
let contractMock = mock({
  blockchain: 'ethereum',
  request: {
    to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    api: [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
    method: 'getAmountsIn',
    params: ["1000000000000000000", ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]],
    return: ["773002376389189", "1000000000000000000"]
  }
})

provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
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

##### Solana: Complex Requests with Parameters

```javascript
let connection = new Connection('https://api.mainnet-beta.solana.com')

let wallet = '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'
let mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

let filters = [
  { dataSize: 165 },
  { memcmp: { offset: 32, bytes: wallet }},
  { memcmp: { offset: 0, bytes: mint }}
]

let requestMock = mock({
  provider: connection,
  blockchain,
  request: {
    method: 'getProgramAccounts',
    to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    params: { filters },
    return: [
      {
        account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
        pubkey: '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb'
      }, {
        account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
        pubkey: 'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ'
      }, {
        account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
        pubkey: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
      }
    ]
  }
})

let accounts = await connection.getProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), { filters })

expect(requestMock).toHaveBeenCalled()

expect(accounts.map((account)=>account.pubkey.toString())).toEqual([
  '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb',
  'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ',
  'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
])
```

#### The "anything" Parameter

```javascript
import { anything } from '@depay/web3-mock'

let contractMock = mock({
  blockchain: 'ethereum',
  request: {
    to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    api: [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
    method: 'getAmountsIn',
    params: [anything, ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]],
    return: ["773002376389189", "1000000000000000000"]
  }
})

provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
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

#### Delay Responses

In order to delay the response for a request in your tests (to emulate real life behaviour), you can use `delay`:

```javascript

let requestMock = mock({
  blockchain: 'ethereum',
  request: {
    delay: 1000,
    to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    api: api,
    method: 'name',
    return: 'DePay'
  }
})

await contract.name() // is gonna take at least 1000ms
```

### Request Code

#### EVM: Request Code

```javascript
mock({
  blockchain: 'ethereum',
  code: {
    for: '0x5Af489c8786A018EC4814194dC8048be1007e390',
    return: '0x'
  }
})

let provider = new ethers.providers.Web3Provider(global.ethereum)

await provider.getCode('0x5Af489c8786A018EC4814194dC8048be1007e390')
// 0x
```

### Transactions

You need to mock transactions before they are executed.

`web3-mock` mocks `eth_sendTransaction`, `eth_getTransactionByHash`, `eth_getTransactionReceipt` request to cover the full lifecycle of blockchain transactions.

#### Simple Transactions

##### EVM: Simple Transactions

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

##### Solana: Simple Transactions

```javascript
let mockedTransaction = mock({
  blockchain,
  transaction: {
    from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
    instructions:[{
      to: '11111111111111111111111111111111',
      api: struct([
        u32('instruction'),
        u64('lamports')
      ])
    }]
  }
})

let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

let transaction = new Transaction({
  recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
  feePayer: fromPubkey
})

transaction.add(
  SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports: 1000000000
  })
)

let signedTransaction = await window.solana.signAndSendTransaction(transaction)

expect(signedTransaction).toBeDefined()
expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

expect(mockedTransaction).toHaveBeenCalled()
```

#### Mock Complex Contract Transactions

##### EVM: Mock Complex Contract Transactions

```javascript
let mockedTransaction = mock({
  blockchain: 'ethereum',
  transaction: {
    to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
    api: [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
    from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
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
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
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

##### Solana: Mock Complex Contract Transactions

```javascript
let mockedTransaction = mock({
  blockchain,
  transaction: {
    from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
    instructions:[{
      to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      api: struct([
        u8('instruction'),
        u64('amount')
      ])
    }]
  }
})

let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

const keys = [
  { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
  { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
  { pubkey: fromPubkey, isSigner: true, isWritable: false }
]

let TRANSFER_LAYOUT = struct([
  u8('instruction'),
  u64('amount')
])
const amount = 1000000000
const data = Buffer.alloc(TRANSFER_LAYOUT.span)
TRANSFER_LAYOUT.encode({
  instruction: 3, // TRANSFER
  amount: new BN(amount)
}, data)

let transaction = new Transaction({
  recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
  feePayer: fromPubkey
})

transaction.add(
  new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
)

let signedTransaction = await window.solana.signAndSendTransaction(transaction)

expect(signedTransaction).toBeDefined()
expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)

expect(mockedTransaction).toHaveBeenCalled()
````

##### Solana: Mock simulateTransaction

```javascript
let connection = new Connection('https://api.mainnet-beta.solana.com')
let logs = ['Program log: GetPoolData: {"status":1,"coin_decimals":9,"pc_decimals":6,"lp_decimals":9,"pool_pc_amount":12754312776324,"pool_coin_amount":379132082877028,"pool_lp_supply":263721383546103,"pool_open_time":0,"amm_id":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}']

let requestMock = mock({
  provider: connection,
  blockchain,
  simulate: {
    from: "RaydiumSimuLateTransaction11111111111111111",
    instructions:[{
      to: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
      api: POOL_INFO
    }],
    return: {
      logs
    }
  }
})

const data = Buffer.alloc(POOL_INFO.span)
POOL_INFO.encode({ instruction: 12, simulateType: 0 }, data)

const keys = [
  { pubkey: new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"), isWritable: false, isSigner: false },
  { pubkey: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), isWritable: false, isSigner: false },
  { pubkey: new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"), isWritable: false, isSigner: false },
  { pubkey: new PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"), isWritable: false, isSigner: false },
  { pubkey: new PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"), isWritable: false, isSigner: false },
  { pubkey: new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"), isWritable: false, isSigner: false },
  { pubkey: new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"), isWritable: false, isSigner: false },
]

const programId = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
const instruction = new TransactionInstruction({
  programId,
  keys,
  data,
})

const feePayer = new PublicKey("RaydiumSimuLateTransaction11111111111111111")

let transaction = new Transaction({ feePayer })
transaction.add(instruction)

let result = await connection.simulateTransaction(transaction)
expect(result.value.logs).toEqual(logs)
```

#### Confirm mocked transactions

Confirming transaction mocks consists of two steps:

1. Confirming the mocked transaction once (which also increase block number by 1 implicitly)
2. Increase the blocknumber after the transaction has been confirmed (to increase transaction confirmation amount e.g. for safe amount of confirmations)

##### EVM: Confirm mocked transactions

```javascript
import { mock, confirm } from '@depay/web3-mock'

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
import { mock, confirm, increaseBlock } from '@depay/web3-mock'

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

##### Solana: Confirm mocked transactions

```javascript
let mockedTransaction = mock({
  blockchain,
  transaction: {
    from: "2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1",
    instructions:[{
      to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      api: struct([
        u8('instruction'),
        u64('amount')
      ]),
      params: {
        instruction: 3,
        amount: anything
      }
    }]
  }
})

let fromPubkey = new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
let toPubkey = new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa')

let fromTokenAccount = new PublicKey('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
let toTokenAccount = new PublicKey('9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y')

const keys = [
  { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
  { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
  { pubkey: fromPubkey, isSigner: true, isWritable: false }
]

let TRANSFER_LAYOUT = struct([
  u8('instruction'),
  u64('amount')
])
const amount = 1000000000
const data = Buffer.alloc(TRANSFER_LAYOUT.span)
TRANSFER_LAYOUT.encode({
  instruction: 3, // TRANSFER
  amount: new BN(amount)
}, data)

let transaction = new Transaction({
  recentBlockhash: 'H1HsQ5AjWGAnW7f6ZAwohwa4JzNeYViGiG22NbfvUKBE',
  feePayer: fromPubkey
})

transaction.add(
  new TransactionInstruction({ keys, programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), data })
)

let signedTransaction = await window.solana.signAndSendTransaction(transaction)

expect(signedTransaction).toBeDefined()
expect(signedTransaction.publicKey).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
expect(signedTransaction.signature).toEqual(mockedTransaction.transaction._id)
expect(mockedTransaction).toHaveBeenCalled()

let status = await window.solana.getSignatureStatus(mockedTransaction.transaction._id)
expect(status.value).toEqual(null)

confirm(mockedTransaction)
status = await window.solana.getSignatureStatus(mockedTransaction.transaction._id)
expect(status.value).not.toEqual(null)
expect(status.value.confirmationStatus).toEqual('confirmed')
expect(status.value.confirmations).toEqual(0)
```

#### Mock transactions fail/revert

Mocking transactions fail/revert:

```javascript
import { mock, fail } from '@depay/web3-mock'

let mockedTransaction = mock({
  blockchain: 'ethereum',
  transaction: {
    to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
    value: '1000000000000000000'
  }
})

fail(mockedTransaction, 'REASON')

await sentTransaction.wait(1).catch(()=>{ console.log('transaction failed') })
```

#### Mock replacing transaction

```javascript
import { mock, replace } from '@depay/web3-mock'

let transaction = {
  to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
  from: accounts[0],
  value: "2000000000000000000"
}

let transactionMock = mock({
  blockchain,
  transaction
})

let provider = new ethers.providers.Web3Provider(global.ethereum);
let signer = provider.getSigner();

let sentTransaction = await signer.sendTransaction({
  to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
  value: ethers.utils.parseEther("2")
})

let transactionError
sentTransaction.wait(1).catch((error)=>{
  transactionError = error
})

let replacingTransactionMock = mock({
  blockchain,
  transaction
})

replace(transactionMock, replacingTransactionMock)

await new Promise((r) => setTimeout(r, 2000));

expect(transactionError.code).toEqual('TRANSACTION_REPLACED')
```

In case you need to have the replacing transaction fail simply pass `false` as the third argument:

```javascript
replace(transactionMock, replacingTransactionMock, false)

await new Promise((r) => setTimeout(r, 2000));

expect(transactionError.code).toEqual('TRANSACTION_REPLACED')
expect(transactionError.receipt.status).toEqual(0)
```

#### Mock Transactions partialy with anything

```javascript
let mockedTransaction = mock({
  blockchain: 'ethereum',
  transaction: {
    from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
    api: [],
    method: 'route',
    params: {
      path: [anything, "0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
      amounts: anything
    }
  }
})

let provider = new ethers.providers.Web3Provider(global.ethereum);

let contract = new ethers.Contract(
  "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
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
```

#### Delay transactions

In order to delay the response of a transaction in your tests (to emulate real life behaviour), you can use `delay`:

```javascript

let requestMock = mock({
  blockchain: 'ethereum',
  transaction: {
    delay: 1000,
    from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
    api: [],
    method: 'route',
    params: {
      path: [anything, "0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
      amounts: anything
    }
  }
})

// this is gonna take at least 1000ms
let transaction = await contract.connect(signer).route(
  ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
  ["773002376389189", "1000000000000000000", "3623748721"],
  [],
  [],
  [],
  { value: 0 }
)
```

### Estimates

Explicit estimate mocks are not required, they are implicitly mocked with a default value once web3-mock is initalized.

In case you want to explicitly want to test that your code performs an estimate and does not perform the transaction, use estimate mocks:

```javascript
import { mock } from '@depay/web3-mock'

let mockedEstimate = mock({
  blockchain: 'ethereum',
  estimate: {
    api: ERC20,
    from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    method: 'transfer',
    return: '200' // the gas you want to be returned to your code
  }
})

let provider = new ethers.providers.Web3Provider(global.ethereum)
let signer = provider.getSigner()
let contract = new ethers.Contract(
  '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
  ERC20,
  provider
)

let estimate = await contract.connect(signer).estimateGas.transfer('0xd8da6bf26964af9d7eed9e03e53415d37aa96045', '100')

expect(estimate.toString()).toEqual('200')
expect(mockedEstimate).toHaveBeenCalled()
```

In case you want to require all estimate requests being mocked you need to enable that explicitly (unlike calls or transactions which are always required):

```javascript
import { mock } from '@depay/web3-mock'

mock({ blockchain: 'ethereum', require: 'estimate' })
```

### Signature

`web3-mock` allows you to mock signatures:

```javascript
let message = "This is a message to be signed\n\nAnd a new line"
const messageUtf8 = ethers.utils.toUtf8Bytes(message)
const messageHex = ethers.utils.hexlify(messageUtf8).substring(2)

mock({
  blockchain: 'ethereum',
  signature: {
    params: [accounts[0], `0x${messageHex}`],
    return: "0x123456"
  }
})

await signer.signMessage(message)
// RawSignature
// "0x123456"
```
including signed data:

```javascript
let data = {
    domain: {
        ...
    },
    message: {
        ...
    },
    primaryType: 'Person',
    types: {
        ...
    },
}
const messageHex = sigUtil.signTypedData_v4(secret, { data })
mock({
    blockchain: 'ethereum',
    accounts :{ return :accounts},
    signature: {
        params: [accounts[0], JSON.stringify(data)],
        return: "0x123456"
    }
})

//code under test
await window.ethereum.request({ 
    method: 'eth_signTypedData_v4',
    params: [accounts[0], JSON.stringify(data)],
    from: accounts[0]
})
// RawSignature
// "0x123456"
```

Also allows to delay signature:

```javascript
mock({
  blockchain: 'ethereum',
  signature: {
    params: [accounts[0], `0x${messageHex}`],
    return: "0x123456",
    delay: 5000
  }
})
```

### Balance

`web3-mock` allows you to mock balance requests:

#### EVM: Balance

```javascript
let balanceMock = mock({
  blockchain: 'ethereum',
  balance: {
    for: '0xb0252f13850a4823706607524de0b146820F2240',
    return: '232111122321'
  }
})

let provider = new ethers.providers.Web3Provider(global.ethereum);
let balance = await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')
// BigNumber<'232111122321'>
```

```javascript
let balanceMock = mock({
  blockchain: 'ethereum',
  balance: {
    for: '0xb0252f13850a4823706607524de0b146820F2240',
    return: '123'
  }
})

let provider = new ethers.providers.Web3Provider(global.ethereum);
let signer = provider.getSigner();
let balance = await signer.getBalance()
// BigNumber<'123'>
```

#### Solana: Balance

```javascript
let connection = new Connection('https://api.mainnet-beta.solana.com')

let balanceMock = mock({
  provider: connection,
  blockchain: 'solana',
  balance: {
    for: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
    return: 232111122321
  }
})

await connection.getBalance(new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'))
// 232111122321
```

### Network

`web3-mock` allows you to mock interacting with a wallets network setting (like switching or adding networks).

#### EVM: Switch Network

```javascript
let switchMock = mock({
  blockchain: 'ethereum',
  network: {
    switchTo: 'bsc'
  }
})

let blockchain = Blockchain.findByName('bsc')

await global.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: blockchain.id }] })
```

```javascript
let switchMock = mock({
  blockchain: 'ethereum',
  network: {
    switchTo: 'bsc',
    error: ()=> {
      return { code: 4902 }
    }
  }
})

let blockchain = Blockchain.findByName('bsc')

await global.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: blockchain.id }] })
// throws { code: 4902 }
```

```javascript
let blockchain = Blockchain.findByName('bsc')

let addMock = mock({
  blockchain: 'ethereum',
  network: {
    add: {
      chainId: blockchain.id,
      chainName: blockchain.fullName,
      nativeCurrency: {
        name: blockchain.currency.name,
        symbol: blockchain.currency.symbol,
        decimals: blockchain.currency.decimals
      },
      rpcUrls: [blockchain.rpc],
      blockExplorerUrls: [blockchain.explorer],
      iconUrls: [blockchain.logo]
    }
  }
})

await global.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: blockchain.id,
    chainName: blockchain.fullName,
    nativeCurrency: {
      name: blockchain.currency.name,
      symbol: blockchain.currency.symbol,
      decimals: blockchain.currency.decimals
    },
    rpcUrls: [blockchain.rpc],
    blockExplorerUrls: [blockchain.explorer],
    iconUrls: [blockchain.logo]
  }]
})
```

#### Connect wallet to another blockchain

```javascript
import { connect } from '@depay/web3-mock'

connect('ethereum')

// ...

connect('bsc')
```

### Errors

For all mocking types (`request`, `transaction`, `estimate` & `balance`) you can also test error cases by setting `return` to an `Error`:

```language
mock({
  blockchain: 'ethereum',
  request: {
    //...
    return: Error('Some error happened')
  }
})
```

### Events

`web3-mock` allows you to trigger events (like `accountsChanged`).

```javascript
import { mock, trigger } from '@depay/web3-mock'

mock('ethereum')

// some other prep and test code

trigger('accountsChanged', ['0xb0252f13850a4823706607524de0b146820F2240', '0xEcA533Ef096f191A35DE76aa4580FA3A722724bE'])
```

also allows you to trigger walletConnect events, too:

```javascript
import { mock, trigger } from '@depay/web3-mock'
import { wallets } from '@depay/web3-wallets'

mock({ blockchain: 'ethereum', wallet: 'walletconnect', connector: wallets.WalletConnect })

trigger('connected', [error, payload])
```

In order to achieve event mocking, `web3-mock` mocks internal event handling via `.on`, `.removeListener` and `.off`.

### Providers

If you want to mock Web3 requests and transactions for a specific provider, pass the provider you want to instrument:

#### EVM: Providers

```javascript

let provider = new ethers.providers.JsonRpcProvider('https://example.com');
    
mock({
  provider,
  blockchain: 'ethereum'
  // ...
})
```

#### Solana: Providers

```javascript
let connection = new Connection('https://api.mainnet-beta.solana.com')

mock({
  provider: connection,
  blockchain: 'solana',
  balance: {
    for: '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa',
    return: 232111122321
  }
})

let balance = await connection.getBalance(new PublicKey('5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'))

expect(balance).toEqual(232111122321)
```

### Wallets

Crypto wallets identify themselfs differently, in order to mock those wallet identifications, you can also use `mock`:

```javascript
mock({
  blockchain: 'ethereum',
  wallet: 'metamask'
})

window.ethereum.isMetaMask // true
```

#### MetaMask

```javascript
mock({
  blockchain: 'ethereum',
  wallet: 'metamask'
})

window.ethereum.isMetaMask // true
```

#### Coinbase

```javascript
mock({
  blockchain: 'ethereum',
  wallet: 'coinbase'
})

window.ethereum.isCoinbaseWallet // true
window.ethereum.isWalletLink // true
```

#### WalletConnect

```javascript
import { wallets } from '@depay/web3-wallets'

mock({
  blockchain: 'ethereum',
  wallet: 'walletconnect',
  connector: wallets.WalletConnect
})

// simulates walletconnect connect flow
// and allows to trigger walletconnect events with "trigger"
```

#### Coinbase WalletLink

```javascript
import { wallets } from '@depay/web3-wallets'

mock({
  blockchain: 'ethereum',
  wallet: 'walletlink',
  connector: wallets.WalletLink
})

// simulates coinbase walletlink connect flow
// and allows to trigger walletlink events with "trigger"
```

### Test Helpers

#### normalize

`normalize` allows you to normalize values to compare them easier in tests:

```javascript
import { normalize } from '@depay/web3-mock'

expect(
  normalize('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D')
).toEqual('0x7a250d5630b4cf539739df2c5dacb4c659f2488d')

expect(
  normalize(ethers.BigNumber.from('1000'))
).toEqual('1000')
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

In your jest test environment `global` is the `window` available to your code.

Hence `web3-mock` instrumentalizes Jest's `global` automatically when using `web3-mock` in a jest test environment.

Make sure you add the following to your jest setup (tests/setup.js).

```javascript
// web3-mock polyfills:
global.XMLHttpRequest = require('xhr2')
global.location = { host: undefined }
```

Install xhr2 as a dev dependency if it is not already installed.

#### Cypress

In your cypress test environment `cy.window().specWindow.window` is the `window` available to your code.

Hence `web3-mock` takes cypress's `cy.window().specWindow.window` automatically when using `web3-mock` in a cypress test environment.

`web3-mock` supports [Cypress's Sinon-Chai](https://docs.cypress.io/guides/references/assertions#Sinon-Chai) matchers for `called`, `calledOnce` and `callCount(n)`:

```javascript
let transactionMock = mock({ ... })

expect(transactionMock).to.have.been.called
expect(transactionMock).to.have.been.calledOnce
expect(transactionMock).to.have.been.callCount(n)
```

#### Playwright

Playwright requires the following setup in your playwright config file:

```javascript
// web3-mock polyfills:
global.XMLHttpRequest = require('xhr2')
global.location = { host: undefined }
```
