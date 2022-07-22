import { mock, resetMocks } from '../../src'
import { ethers } from 'ethers'

describe('mock', ()=> {

  describe('mocked', ()=> {

    beforeEach(()=>mock('ethereum'))

    afterEach(resetMocks)
    
    it('mocks cy.window().specWindow.window per default', () => {
      expect(typeof cy.window().specWindow.window.ethereum).equal('object')
    })
  })

  it('reset mocks properly', () => {
    expect(typeof cy.window().specWindow.window.ethereum).equal('undefined')
  })

  it('supports chai matcher that come with cypress', async ()=> {

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

    let provider = new ethers.providers.Web3Provider(cy.window().specWindow.window.ethereum)

    let signer = provider.getSigner()

    await signer.sendTransaction({
      to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
      value: ethers.utils.parseEther("2")
    })

    expect(transactionMock).to.have.been.called
    expect(transactionMock).to.have.been.calledOnce
    expect(transactionMock).to.have.been.callCount(1)
  })
})
