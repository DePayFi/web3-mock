let rpcResponse = ({ value, result }) => {
  if(result) {
    return { jsonrpc: '2.0', id: '1', result }
  } else {
    return { jsonrpc: '2.0', id: '1', result: { context:{ apiVersion: '1.10.26', slot: 140152926 }, value } }
  }
}

export { rpcResponse }
