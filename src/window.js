let getWindow = (configuration) => {
  if (configuration?.window) return configuration.window
  if (typeof global == 'object') return global
  if (typeof window == 'object') return window
}

export { getWindow }
