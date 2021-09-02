import { mock, resetMocks } from '../../src'

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
})
