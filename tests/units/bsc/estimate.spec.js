import { ethers } from 'ethers'
import { mock, resetMocks, confirm, anything } from '../../../src'

describe('mock ethereum estimates', ()=> {

  let ERC20 = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('does not require estimate mocks per default', async ()=> {
    
    mock('ethereum')

    let provider = new ethers.providers.Web3Provider(global.ethereum)
    let signer = provider.getSigner()
    let contract = new ethers.Contract(
      '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
      ERC20,
      provider
    )

    let estimate = await contract.connect(signer).estimateGas.transfer('0xd8da6bf26964af9d7eed9e03e53415d37aa96045', '100')
    expect(estimate.toString()).toEqual('181408')
  })

  it('requires mocks and suggests how to mock in case estimate mocks have been required', async ()=> {
    
    mock({ blockchain: 'ethereum', require: 'estimate' })

    let provider = new ethers.providers.Web3Provider(global.ethereum)
    let signer = provider.getSigner()
    let contract = new ethers.Contract(
      '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
      ERC20,
      provider
    )

    await expect(
      contract.connect(signer).estimateGas.transfer('0xd8da6bf26964af9d7eed9e03e53415d37aa96045', '100')
    ).rejects.toEqual(
      "Web3Mock: Please mock the estimate: {\"blockchain\":\"ethereum\",\"estimate\":{\"to\":\"0xa0bed124a09ac2bd941b10349d8d224fe3c955eb\",\"api\":[\"PLACE API HERE\"],\"return\":\"ESTIMATED GAS\"}}"
    )
  })

  it('mocks a simple estimate', async ()=> {
    
    let mockedEstimate = mock({
      blockchain: 'ethereum',
      estimate: {
        api: ERC20,
        from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        method: 'transfer',
        return: '200'
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
  })

  it('mocks a complex estimate', async ()=> {

    let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
    
    let mockedEstimate = mock({
      blockchain: 'ethereum',
      estimate: {
        from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        api: api,
        method: 'route',
        params: {
          path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          amounts: ["773002376389189", "1000000000000000000", "3623748721"]
        },
        return: '300'
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let contract = new ethers.Contract(
      "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
      api,
      provider
    );

    let signer = provider.getSigner();

    let estimate = await contract.connect(signer).estimateGas.route(
      ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
      ["773002376389189", "1000000000000000000", "3623748721"],
      [],
      [],
      [],
      { value: 0 }
    )

    expect(estimate.toString()).toEqual('300')
    expect(mockedEstimate).toHaveBeenCalled()
  })

  it('implicitly mocks estimates if a transaction is mocked', async ()=> {
    let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
    
    let mockedTransaction = mock({
      blockchain: 'ethereum',
      transaction: {
        from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        api: api,
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
      api,
      provider
    );

    let signer = provider.getSigner();

    let estimate = await contract.connect(signer).estimateGas.route(
      ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
      ["773002376389189", "1000000000000000000", "3623748721"],
      [],
      [],
      [],
      { value: 0 }
    )

    expect(estimate.toString()).toEqual('181408')
    expect(mockedTransaction).not.toHaveBeenCalled()
  })

  it('suggests how to mock if an error if a complex mock does not match the actual call', async ()=> {
    let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
    
    let mockedEstimate = mock({
      blockchain: 'ethereum',
      estimate: {
        from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        api: api,
        method: 'NotRoute',
        params: {
          path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          amounts: ["773002376389189", "1000000000000000000", "3623748721"]
        },
        return: '300'
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let contract = new ethers.Contract(
      "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
      api,
      provider
    );

    let signer = provider.getSigner();

    await expect(
      contract.connect(signer).estimateGas.route(
        ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
        ["773002376389189", "1000000000000000000", "3623748721"],
        [],
        [],
        [],
        { value: 0 }
      )
    ).rejects.toEqual(
      "Web3Mock: Please mock the estimate: {\"blockchain\":\"ethereum\",\"estimate\":{\"to\":\"0xae60ac8e69414c2dc362d0e6a03af643d1d85b92\",\"api\":[\"PLACE API HERE\"],\"return\":\"ESTIMATED GAS\",\"method\":\"route\",\"params\":{\"path\":[\"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\",\"0xa0bed124a09ac2bd941b10349d8d224fe3c955eb\"],\"amounts\":[\"773002376389189\",\"1000000000000000000\",\"3623748721\"],\"addresses\":[],\"plugins\":[],\"data\":[]}}}"
    )
  })

  it('fails the estimate if you mock an Error', async ()=> {
    
    let mockedEstimate = mock({
      blockchain: 'ethereum',
      estimate: {
        api: ERC20,
        from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        method: 'transfer',
        return: Error('Some issue')
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum)
    let signer = provider.getSigner()
    let contract = new ethers.Contract(
      '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
      ERC20,
      provider
    )

    await expect(
      contract.connect(signer).estimateGas.transfer('0xd8da6bf26964af9d7eed9e03e53415d37aa96045', '100')
    ).rejects.toEqual(new Error('Some issue'))

    expect(mockedEstimate).toHaveBeenCalled()
  })
})
