import raise from '../../raise'

let request = ({ blockchain, request, provider }) => {

  switch (request.method) {

    default:
      raise('Web3Mock request: Unknown request method ' + request.method + '!')
  }
}

export { request }
