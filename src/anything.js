import normalize from './normalize'

let anything = '__ANYTHING__'

let fillMockParamsWithAnything = ({ contractArguments, mockParams }) => {
  if (typeof mockParams === 'object' && !Array.isArray(mockParams) && !mockParams._isBigNumber) {
    let filledMockParams = {}
    Object.keys(mockParams).forEach((key) => {
      filledMockParams[key] = fillMockParamsWithAnything({
        contractArguments: contractArguments[key],
        mockParams: mockParams[key],
      })
    })
    return filledMockParams
  } else if (Array.isArray(mockParams)) {
    return mockParams.map((element, index) => {
      return fillMockParamsWithAnything({
        contractArguments: contractArguments[index],
        mockParams: element,
      })
    })
  } else {
    if (mockParams === anything) {
      return normalize(contractArguments)
    } else {
      return mockParams
    }
  }
}

let anythingDeepMatch = ({ contractArguments, mockParams }) => {
  let filledMockParams = fillMockParamsWithAnything({ contractArguments, mockParams })
  return Object.keys(filledMockParams).every((key) => {
    return (
      JSON.stringify(normalize(filledMockParams[key])) ==
      JSON.stringify(normalize(contractArguments[key]))
    )
  })
}

let anythingMatch = ({ contractArguments, mockParams }) => {
  if (
    mockParams === anything &&
    typeof contractArguments !== 'undefined' &&
    contractArguments.length > 0
  ) {
    return true
  } else if (!JSON.stringify(mockParams).match(anything)) {
    return false
  } else if (Array.isArray(mockParams) && anythingDeepMatch({ contractArguments, mockParams })) {
    return true
  }

  return false
}

export {
  anything,
  anythingMatch,
  anythingDeepMatch
}

