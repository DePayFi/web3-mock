import { mock } from '../../../../src'

describe('mock', () => {
  
  it('does not change existing values in the window/global object', () => {

    global.someVar = 1
    global.ethereum = { existedAlready: 1 }

    mock('ethereum')

    expect(global.someVar).toEqual(1)
    expect(global.ethereum.existedAlready).toEqual(1)
  });

  it('fails if no mock has been defined', () => {

    expect(() => {
      mock()
    }).toThrowError('Web3Mock: No mock defined!');

    expect(() => {
      mock(undefined);
    }).toThrowError('Web3Mock: No mock defined!');

  });

  it('fails if mock has wrong type', () => {

    expect(() => {
      mock([1]);
    }).toThrowError('Web3Mock: Unknown mock configuration type!');

  });

  it('fails if mock is empty', () => {

    expect(() => {
      mock({});
    }).toThrowError('Web3Mock: Mock configuration is empty!');

  });

  it('fails if the mocked blockchain has not been found', () => {

    expect(() => {
      mock('nonexistingblockchain')
    }).toThrowError('Web3Mock: Unknown blockchain!');

  });

  it('takes jest "global" automatically if there is no window but a global', () => {
    mock('ethereum');
  });

  
});
