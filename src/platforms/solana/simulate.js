import raise from './../../raise'
import { findMock } from './findMock'

let simulateTransaction = ({ blockchain, params, provider }) => {
  let mock = findMock({ type: 'simulate', params, provider })

  if(!mock) {
    raise(
      'Web3Mock: Please mock the simulation: ' +
      JSON.stringify({
        blockchain,
        simulate: {
          from: params.feePayer.toString(),
          instructions: params.instructions.map((instruction)=>{
            return {
              to: instruction.programId,
              api: 'API HERE'
            }
          }),
          return: "YOUR RETURN HERE"
        }
      })
    )
  } else {
    return({ value: mock.simulate.return })
  }
}

export {
  simulateTransaction
}
