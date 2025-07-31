const { initWormhole } = require('../strategies/crosschain/wormhole');

describe('Wormhole Integration', () => {
  it('should initialize Wormhole', async () => {
    await expect(initWormhole()).resolves.toBeUndefined();
  });
});
