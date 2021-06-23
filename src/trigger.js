import mocks from './mocks'

export default (eventName, value) => {
  mocks.forEach((mock) => mock.trigger(eventName, value))
}
