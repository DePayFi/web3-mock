import { mock, resetMocks } from '../src'
import { ethers } from 'ethers'

const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  mock('ethereum')
})

test.describe('Support Playwright', () => {
  
  test('should allow me to mock web3', async ({ page }) => {
    mock({
      blockchain: 'ethereum',
      accounts: {
        return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      }
    })
    
    let transactionMock = mock({
      blockchain: 'ethereum',
      transaction: {
        from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        to: '0x5Af489c8786A018EC4814194dC8048be1007e390',
        value: "2000000000000000000"
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum)

    let signer = provider.getSigner()

    await signer.sendTransaction({
      to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
      value: ethers.utils.parseEther("2")
    })

    expect(transactionMock).toHaveBeenCalled()
  })
})
