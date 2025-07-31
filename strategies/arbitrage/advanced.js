const { findArbitrageOpportunity } = require('./simple');
const { broadcastLog } = require('../../utils/logger');

async function findAdvancedArbitrage(tokenIn, tokenOut, chainId, network) {
  const opportunity = await findArbitrageOpportunity(tokenIn, tokenOut, chainId, network);
  if (opportunity) {
    broadcastLog(`Advanced arbitrage opportunity found: ${JSON.stringify(opportunity)}`);
    return { ...opportunity, strategy: 'advanced' };
  }
  return null;
}

module.exports = { findAdvancedArbitrage };
