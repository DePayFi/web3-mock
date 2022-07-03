import getRandomTransactionHash from './platforms/evm/transaction/getRandomTransactionHash'
import raise from './raise'
import { getTransactionCount, increaseTransactionCount } from './platforms/evm/transaction/count'
import { increaseBlock, getCurrentBlock, setBlockData } from './block'

export default (transactionMock, replacingTransactionMock, confirmed = true) => {
  if(transactionMock == undefined || replacingTransactionMock == undefined) { raise('replace requires (transactionMock, replacingTransactionMock)') }
  if(transactionMock.transaction.from == undefined) { raise('transactionMock to be replaced requires at least a "from"') }

  replacingTransactionMock.transaction._id = getRandomTransactionHash()
  if(confirmed){
    replacingTransactionMock.transaction._confirmed = true
  } else {
    replacingTransactionMock.transaction._failed = true
  }
  setBlockData(getCurrentBlock(), {
    "number": "0xd6fa38",
    "baseFeePerGas": "0x2d79336308",
    "difficulty": "0x2ca5a8551de6c9",
    "extraData": "0x6575726f70652d63656e7472616c322d33",
    "gasLimit": "0x1ca35d2",
    "gasUsed": "0x4f1487",
    "hash": "0x8110e001148adad4d749559998e82061aa7d11bfdab65b840608327f98550fbc",
    "logsBloom": "0x04200102130400839382604c8300800e003008904824c0060100214904200e03012450500400101050704850004005208a028000092171092200140020202001c24221a08488114c08a4000c844008340024058014408121408021d1c04401011320800023240000031050205300088921155204008186203102141410180102d840890204a0d202001801070004003010060011030081090000044800100e0462580e48280221000a2020d0801186a80001800922060000506288a092c81814c1482202402041882514000204008800c00c3300044900102860814e088221219411248a86440000020017c104088b10404180012100004000011892002004b8",
    "miner": "0xea674fdde714fd979de3edf0f56aa9716b898ec8",
    "mixHash": "0x3c18abd91830b37cab8451afbbfb480de19bfc43e6cb9dea4b2eac1c41c81c2b",
    "nonce": "0x41fdf9e14a45d935",
    "parentHash": "0x885327d9913d7effef8532b5ee0815b1711a279b3414da90b93f175135701803",
    "receiptsRoot": "0x605fecc910c7e00a244da10635b170f7eabded9449321e79b73e42eb82619747",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "size": "0x6e63",
    "stateRoot": "0xc5549451a31830f2cbba18453066f9ef7539243f58ee1340341d1376a87ffd56",
    "timestamp": "0x61f2c7ec",
    "totalDifficulty": "0x87820e2f3a1f8913fee",
    "transactionsRoot": "0x5582fa18ef2f1eb6a4f3ca7d225b9fb1050074293cd30127ef3919a35fd50d2b",
    "uncles": [],
    transactions: [
      {
        "hash": replacingTransactionMock.transaction._id,
        "accessList": [],
        "blockHash": "0x8110e001148adad4d749559998e82061aa7d11bfdab65b840608327f98550fbc",
        "blockNumber": "0xd6fa38",
        "from": transactionMock.transaction.from,
        "gas": "0x55730",
        "gasPrice": "0x2d79336308",
        "input": "0x8803dbee0000000000000000000000000000000000000000001782b76fd64557b6b780000000000000000000000000000000000000000000000000032a27fd31187d551000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000008817d887960737a604cf712d3e5da8673dddb7f00000000000000000000000000000000000000000000000000000000061f2ca440000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000090185f2135308bad17527004364ebcc2d37e5f6",
        "maxFeePerGas": "0x2e87159fb3",
        "maxPriorityFeePerGas": "0x0",
        "nonce": getTransactionCount(transactionMock.transaction.from),
        "r": "0x81d4fe714af2e1725ad1746fc240a6ac3b0f795d207ac207f36abaf8db6c72b2",
        "s": "0x3c4f61eef2ecb98a50bf3940bc90e7dcacbc7f233a57d5eb44c0ae07fdec4ced",
        "to": "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
        "transactionIndex": "0x0",
        "type": "0x2",
        "v": "0x0",
        "value": "0x0"
      }
    ]
  })
  increaseBlock()
  increaseTransactionCount(transactionMock.transaction.from)
}
