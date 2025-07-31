const { executeArbitrageSolana } = require('./solana');
const config = require('../../config/config');

async function executeRaydiumTrade(opportunity) {
  await executeArbitrageSolana({ ...opportunity, dex: 'Raydium' }, 'solana');
}

module.exports = { executeRaydiumTrade };
