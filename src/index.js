import confirm from './confirm'
import fail from './fail'
import mock from './mock'
import normalize from './normalize'
import trigger from './trigger'
import { anything } from './anything'
import { increaseBlock, getCurrentBlock, resetCurrentBlock } from './block'
import { resetMocks } from './mocks'
import { setCurrentNetwork as connect } from './network'

export {
  mock,
  trigger,
  resetMocks,
  confirm,
  fail,
  increaseBlock,
  getCurrentBlock,
  resetCurrentBlock,
  anything,
  normalize,
  connect
}
