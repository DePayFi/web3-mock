import { ethers } from 'ethers'
import { mock, resetMocks } from '../../src'

describe('mock', ()=> {

  describe('mocked', ()=> {

    beforeEach(resetMocks)
    afterEach(resetMocks)
    
    it('mocks cy.window().specWindow.window per default', () => {
      mock('ethereum')
      expect(typeof cy.window().specWindow.window.ethereum).equal('object')
    })
  })

  it('reset mocks properly', () => {
    mock('ethereum')
    expect(typeof cy.window().specWindow.window.ethereum).equal('undefined')
  })
})
