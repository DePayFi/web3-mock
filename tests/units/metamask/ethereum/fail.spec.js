import { ethers } from 'ethers'
import { mock, resetMocks, fail } from '../../../../src'

describe('mock ethereum transaction failures/reverts', ()=> {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('allows to fail a transaction', async ()=> {
    
    let mockedTransaction = mock({
      blockchain: 'ethereum',
      transaction: {
        to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
        value: '1000000000000000000'
      }
    })

    let provider = new ethers.providers.Web3Provider(global.ethereum);

    let signer = provider.getSigner();

    let sentTransaction;
    let failedTransaction;

    await signer.sendTransaction({
      to: "0x5Af489c8786A018EC4814194dC8048be1007e390",
      value: ethers.utils.parseEther("1")
    }).then(async function(transaction){
      sentTransaction = transaction
    })

    fail(mockedTransaction)

    await sentTransaction.wait(1).catch((error)=>{
      failedTransaction = true      
    })

    expect(failedTransaction).toEqual(true)
  })
})
