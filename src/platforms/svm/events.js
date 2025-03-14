let events = {}

let resetEvents = () => {
  events = {}
}

let triggerEvent = (eventName, value) => {
  if(events[eventName] == undefined) { return }
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

let removeListener = (eventName, callback) => {
  if (events[eventName]) {
    let index = events[eventName].indexOf(callback)
    if (index >= 0) {
      events[eventName].splice(index, 1)
    }
  }
}

export { on, removeListener, resetEvents, triggerEvent }
