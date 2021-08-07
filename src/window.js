let getWindow = (configuration) => {
  if (configuration?.window) return configuration.window
  if (typeof global == 'object') return global
  if (typeof cy == 'object') return cy.window().specWindow.window
  if (typeof window == 'object') return window
}

export { getWindow }
