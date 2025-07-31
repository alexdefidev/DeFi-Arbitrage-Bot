const { checkPoolLiquidity } = require('../strategies/liquidity/check');

describe('Liquidity Check', () => {
  it('should verify pool liquidity', async () => {
    const result = await checkPoolLiquidity('UniswapV3', ['USDC', 'ETH'], 'ethereum');
    expect(typeof result).toBe('boolean');
  });
});
