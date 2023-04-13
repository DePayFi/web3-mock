import raise from './../../raise'
import { findMock } from './findMock'

let simulateTransaction = ({ blockchain, params, provider }) => {
  let mock = findMock({ type: 'simulate', params, provider })

  if(!mock) {

    let from = params?.message?.staticAccountKeys?.length ? params.message.staticAccountKeys[0].toString() : 'FROM'

    raise(
      'Web3Mock: Please mock the simulation: ' +
      JSON.stringify({
        blockchain,
        simulate: {
          from,
          instructions: (params?.message?.compiledInstructions || []).map((instruction)=>{
            
            let to = params?.message?.staticAccountKeys?.length ? params.message.staticAccountKeys[instruction.programIdIndex].toString() : 'TO'
            
            return {
              to,
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
