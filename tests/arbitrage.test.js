const { findArbitrageOpportunity } = require('../strategies/arbitrage/simple');
const config = require('../config/config');

describe('Arbitrage Strategy', () => {
  it('should find arbitrage opportunity', async () => {
    const opportunity = await findArbitrageOpportunity(
      config.tokens.stable[0],
      config.tokens.meme[0].address,
      config.networks.ethereum.chainId,
      'ethereum'
    );
    expect(opportunity).toBeDefined();
  });
});
