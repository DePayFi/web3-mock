import { ethers } from 'ethers'
import { mock, resetMocks } from '../../../src'

describe('mock Ethereum transactions', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('mocks all transactions per default', async ()=> {
    
    mock('ethereum')

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let signer = provider.getSigner();

    let transaction = await signer.sendTransaction({
        to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
        value: ethers.utils.parseEther("1")
    });

    expect(transaction).toBeDefined()
  })

  it('mocks a simple transaction', async ()=> {
    
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

  it('mocks a complex contract call transaction', async ()=> {

    let abi = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
    
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
  })

  it('also mocks transaction receipts for simple transactions', async ()=> {
    
    mock('ethereum')

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let signer = provider.getSigner();

    let transactionReceipt = await signer.sendTransaction({
      to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
      value: ethers.utils.parseEther("1")
    }).then(async function(transaction){
      return await transaction.wait(1)
    })

    expect(transactionReceipt.transactionHash).toBeDefined()
  })

  it('requires you to mock contract call transactions', async ()=> {
    
    mock('ethereum')

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let contract = new ethers.Contract(
      "0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92",
      [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
      provider
    );

    let signer = provider.getSigner();

    await expect(
      contract.connect(signer).route(
        ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
        ["773002376389189", "1000000000000000000", "3623748721"],
        [],
        [],
        [],
        { value: 0 }
      )
    ).rejects.toEqual(
      "Web3Mock: Please mock the transaction to: 0xae60ac8e69414c2dc362d0e6a03af643d1d85b92"
    )
  })

  it('raises an error if a complex mock does not provide the abi in the mock configuration', async ()=> {
    
    await expect(()=>{
      mock({
        blockchain: 'ethereum',
        transaction: {
          to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
          from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          method: 'route',
          params: {
            path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
            amounts: ["773002376389189", "1000000000000000000", "1"]
          }
        }
      })
    }).toThrowError('Web3Mock: Please mock the abi of the contract at: 0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92')
  })

  it('does not call the mock if `from` of the transaction mock is not matching', async ()=> {
    
    let mockedTransaction = mock({
      blockchain: 'ethereum',
      transaction: {
        from: "0x998D342D6a19CE1d9ad32cd77ec075431bA75dA3",
        to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
        value: "1000000000000000000"
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let signer = provider.getSigner();

    await signer.sendTransaction({
      to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
      value: ethers.utils.parseEther("1")
    });
      
    expect(mockedTransaction).not.toHaveBeenCalled();
  })

  it('does not call the mock if `to` of the transaction mock is not matching', async ()=> {
    
    let mockedTransaction = mock({
      blockchain: 'ethereum',
      transaction: {
        to: "0x9EDF1FF5C67f102b55bad0017811399Fe6891140",
        value: "1000000000000000000"
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let signer = provider.getSigner();

    await signer.sendTransaction({
      to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
      value: ethers.utils.parseEther("1")
    })
    
    expect(mockedTransaction).not.toHaveBeenCalled()
  })

  it('raises an error if a complex mock does not match the actual call', async ()=> {

    let abi = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
    
    mock({
      blockchain: 'ethereum',
      transaction: {
        from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        abi: abi,
        method: 'route',
        params: {
          path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          amounts: ["773002376389189", "1000000000000000000", "1"]
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

    await expect(
      contract.connect(signer).route(
        ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
        ["773002376389189", "1000000000000000000", "3623748721"],
        [],
        [],
        [],
        { value: 0 }
      )
    ).rejects.toEqual(
      "Web3Mock: Please mock the transaction to: 0xae60ac8e69414c2dc362d0e6a03af643d1d85b92"
    )
  })
});
