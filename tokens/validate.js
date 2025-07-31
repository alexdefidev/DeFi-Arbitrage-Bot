const Web3 = require('web3');
const { PublicKey } = require('@solana/web3.js');

function validateAddress(address, chain) {
  if (chain === 'solana') {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }
  return Web3.utils.isAddress(address);
}

module.exports = { validateAddress };
