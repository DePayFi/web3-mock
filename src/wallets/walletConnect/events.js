let events = {}

let resetEvents = () => {
  events = {}
}

let triggerEvent = (eventName, values) => {
  if(events[eventName] == undefined) { return }
  events[eventName].forEach(function (callback) {
    callback.apply(null, values)
  })
}

let on = (eventName, callback) => {
  if (events[eventName] === undefined) {
    events[eventName] = []
  }
  events[eventName].push(callback)
}

let off = (eventName) => {
  if (events[eventName]) {
    events[eventName] = []
  }
}

export { on, off, resetEvents, triggerEvent }
