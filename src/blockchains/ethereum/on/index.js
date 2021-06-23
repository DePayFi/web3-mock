let events = {};

let resetEvents = () => {
  events = {}
}

let triggerEvent = (eventName, value) => {
  events[eventName].forEach(function (callback) {
    callback(value)
  })
}

let on = (eventName, callback) => {
  if (events[eventName] === undefined) {
    events[eventName] = []
  }
  events[eventName].push(callback)
}

export { on, resetEvents, triggerEvent }
