const { getEvmWallet, getSolanaWallet } = require('../security/wallet');

describe('Wallet Management', () => {
  it('should throw error for invalid EVM wallet', () => {
    process.env.WALLET_ADDRESS = 'invalid';
    expect(() => getEvmWallet()).toThrow();
  });

  it('should throw error for invalid Solana wallet', () => {
    process.env.SOLANA_PRIVATE_KEY = 'invalid';
    expect(() => getSolanaWallet()).toThrow();
  });
});
