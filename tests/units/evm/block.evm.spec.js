import { ethers } from 'ethers'
import { mock, resetMocks, anything } from 'src/index.evm'
import { supported } from "src/blockchains.evm"

describe('evm mocks request for a specific given block (evm)', ()=> {

  let rejectsWithMatch = async (method, match)=> {
    let raisedError
    try {
      await method()
    } catch (error) { raisedError = error }
    expect(raisedError.message).toMatch(match)
  }

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      let api = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnBeforeRelease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"extension","type":"uint256"}],"name":"extendVestingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastVestingRelease","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingBeneficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingPeriodEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingRewardPerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
      beforeEach(resetMocks)
      let block = 14904791

      it('mocks a request for a specific given block', async ()=>{

        let requestMock = mock({
          blockchain,
          block,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: api,
            method: 'name',
            return: 'DePay',
          }
        })

        provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          api,
          provider
        );

        expect(await contract.name({ blockTag: block })).toEqual('DePay')
        expect(requestMock).toHaveBeenCalled()
      })

      it('asks to mock correctly if request for wrong block', async ()=>{

        let requestMock = mock({
          blockchain,
          block: block-1,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: api,
            method: 'name',
            return: 'DePay',
          }
        })

        provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          api,
          provider
        );

        await rejectsWithMatch(
          async ()=>{ await contract.name({ blockTag: block }) },
          'Web3Mock: Please mock the request'
        )
      })

      it('asks to mock correctly if mock does not defines block', async ()=>{

        let requestMock = mock({
          blockchain,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: api,
            method: 'name',
            return: 'DePay',
          }
        })

        provider = new ethers.providers.Web3Provider(global.ethereum);

        let contract = new ethers.Contract(
          '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          api,
          provider
        );

        await rejectsWithMatch(
          async ()=>{ await contract.name({ blockTag: block }) },
          'Web3Mock: Please mock the request'
        )
      })
    })
  })
})
