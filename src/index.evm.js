import confirm from './confirm.evm'
import replace from './replace.evm'
import fail from './fail.evm'
import mock from './mock.evm'
import normalize from './normalize'
import trigger from './trigger.evm'
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
  replace,
  connect
}
