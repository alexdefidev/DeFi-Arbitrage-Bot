const Web3 = require('web3');
const { PublicKey } = require('@solana/web3.js');
const config = require('../../config/config');
const { broadcastLog } = require('../../utils/logger');

async function addMemeCoin(symbol, address, chain) {
  try {
    if (chain === 'solana') {
      new PublicKey(address);
    } else {
      Web3.utils.isAddress(address);
    }
    config.tokens.meme.push({ symbol, address, chain });
    broadcastLog(`Meme coin ${symbol} added on ${chain}: ${address}`);
  } catch (error) {
    broadcastLog(`Error adding meme coin ${symbol}: ${error.message}`);
  }
}

module.exports = { addMemeCoin };
