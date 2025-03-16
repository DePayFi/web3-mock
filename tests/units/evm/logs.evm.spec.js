import { ethers, id, zeroPadValue } from 'ethers'
import { mock, resetMocks } from 'dist/esm/index.evm'
import { supported } from "src/blockchains"

describe('getLogs', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(()=>{
        resetMocks()
      })

      it('retrieves logs', async () => {

        const log = {
          blockNumber: 16797899,
          blockHash: '0x5948d965ab5805ace0bc7556672c8f475515ac853c4477f17cc49287f402430e',
          transactionIndex: 65,
          removed: false,
          address: '0x6A12C2Cc8AF31f125484EB685F7c0bfcE280B919',
          data: '0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          topics: [
            '0x83f5257fc3f5f94fa653d44d66c91bba315ce36d9c3c00b14278da4d3b635647',
            '0x0000000000000000000000008f0a62ff2ae1fa08b25070b8b5138fb45630456f',
            '0x000000000000000000000000fcd9c98aae3229a5984a27dee7e6c3b77f1622b5',
          ],
          transactionHash: '0x1f6e88067388a82924535eaa2c4af83143652dba3ec518fbc1ee24d7522efa02',
          logIndex: 226
        }

        mock({
          blockchain,
          logs: {
            address: '0x6A12C2Cc8AF31f125484EB685F7c0bfcE280B919',
            topics: [
              '0x83f5257fc3f5f94fa653d44d66c91bba315ce36d9c3c00b14278da4d3b635647',
              '0x0000000000000000000000008f0a62ff2ae1fa08b25070b8b5138fb45630456f',
              '0x000000000000000000000000fcd9c98aae3229a5984a27dee7e6c3b77f1622b5',
            ],
            fromBlock: '0x1',
            toBlock: '0x5',
            return: [log]
          }
        })

        let provider = new ethers.BrowserProvider(global.ethereum)

        const topics = [
          id('Payment(address,address,uint256,address)'),
          zeroPadValue('0x8f0a62Ff2Ae1FA08B25070B8b5138fb45630456F', 32),
          zeroPadValue('0xFcd9C98AAe3229A5984a27dEE7E6C3b77F1622b5', 32)
        ]

        let logs = await provider.getLogs({
          address: '0x6a12c2cc8af31f125484eb685f7c0bfce280b919',
          topics,
          fromBlock: 1,
          toBlock: 5
        })

        expect(logs[0]).toEqual(log)

      })

      it('asks you to mock the logs request', async()=> {

        mock({ blockchain })

        let provider = new ethers.BrowserProvider(global.ethereum)

        const topics = [
          id('Payment(address,address,uint256,address)'),
          zeroPadValue('0x8f0a62Ff2Ae1FA08B25070B8b5138fb45630456F', 32),
          zeroPadValue('0xFcd9C98AAe3229A5984a27dEE7E6C3b77F1622b5', 32)
        ]

        await expect(
          provider.getLogs({
            address: '0x6a12c2cc8af31f125484eb685f7c0bfce280b919',
            topics,
            fromBlock: 1,
            toBlock: 5
          })
        ).rejects.toEqual(
          `Web3Mock: Please mock the logs request: {\"blockchain\":\"${blockchain}\",\"logs\":{\"address\":\"0x6a12c2cc8af31f125484eb685f7c0bfce280b919\",\"topics\":[\"0x83f5257fc3f5f94fa653d44d66c91bba315ce36d9c3c00b14278da4d3b635647\",\"0x0000000000000000000000008f0a62ff2ae1fa08b25070b8b5138fb45630456f\",\"0x000000000000000000000000fcd9c98aae3229a5984a27dee7e6c3b77f1622b5\"],\"fromBlock\":\"0x1\",\"toBlock\":\"0x5\",\"return\":[\"THE_RETURNED_LOGS\"]}}`
        )
      })
    })
  })
})
