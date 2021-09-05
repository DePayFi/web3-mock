import { ethers } from 'ethers'
import { normalize } from 'src'

describe('normalize', () => {
  
  it('normalizes address to compare them easily', () => {
    expect(
      normalize('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D')
    ).toEqual('0x7a250d5630b4cf539739df2c5dacb4c659f2488d')
  });

  it('normalizes BigNumbers to compare them easily', () => {
    expect(
      normalize(ethers.BigNumber.from('1000'))
    ).toEqual('1000')
  });

  it('normalizes an array of addresses to compare them easily', () => {
    expect(
      normalize(['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'])
    ).toEqual(['0x7a250d5630b4cf539739df2c5dacb4c659f2488d', '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'])
  });
});
