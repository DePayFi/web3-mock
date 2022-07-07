import { Blockchain } from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { mock, resetMocks } from 'src'

describe('evm network', ()=> {

  beforeEach(resetMocks)

  it('mocks a switch to a different network', async ()=>{

    let switchMock = mock({
      blockchain: 'ethereum',
      network: {
        switchTo: 'bsc'
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum)
    let blockchain = Blockchain.findByName('bsc')

    await global.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: blockchain.id }] })

    expect(switchMock).toHaveBeenCalled()

    let balanceMock = mock({
      blockchain: 'bsc',
      balance: {
        for: '0xb0252f13850a4823706607524de0b146820f2240',
        return: '200000'
      }
    })
    
    await provider.getBalance('0xb0252f13850a4823706607524de0b146820F2240')

    expect(balanceMock).toHaveBeenCalled()
  })

  it('fails with the given error when switching networks', async ()=>{
    let errorCallbackCalled

    let switchMock = mock({
      blockchain: 'ethereum',
      network: {
        switchTo: 'bsc',
        error: ()=> {
          errorCallbackCalled = true
          return { code: 4902 }
        }
      },
    })

    let blockchain = Blockchain.findByName('bsc')

    await expect(()=>
      global.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: blockchain.id }] })
    ).rejects.toEqual(
      { code: 4902 }
    )

    expect(switchMock).toHaveBeenCalled()
    expect(errorCallbackCalled).toEqual(true)
  })

  it('suggests to mock a network switch', async ()=>{

    mock('ethereum')
    let blockchain = Blockchain.findByName('bsc')

    await expect(()=>
      global.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: blockchain.id }] })
    ).toThrow(
      "Web3Mock: Please mock the network switch: {\"blockchain\":\"ethereum\",\"network\":{\"switchTo\":\"bsc\"}}"
    )
  })

  it('mocks adding an additional network', async ()=>{
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

    expect(addMock).toHaveBeenCalled()
  })

  it('suggests to mock a network addition', async ()=>{

    mock('ethereum')
    let blockchain = Blockchain.findByName('bsc')
    let addition = {
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

    await expect(()=>
      global.ethereum.request({ method: 'wallet_addEthereumChain', params: [addition]})
    ).toThrow(
      `Web3Mock: Please mock the network addition: {\"blockchain\":\"ethereum\",\"network\":{\"add\":${JSON.stringify(addition)}}}`
    )
  })

  it('finds the right network mock even if there are multiple', async ()=>{
    let switchMock = mock({
      blockchain: 'ethereum',
      network: {
        switchTo: 'bsc'
      }
    })

    mock({
      blockchain: 'ethereum',
      network: {
        add: {}
      }
    })

    let blockchain = Blockchain.findByName('bsc')

    await global.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: blockchain.id }] })    

    expect(switchMock).toHaveBeenCalled()
  })
})
