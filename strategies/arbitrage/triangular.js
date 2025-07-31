const { findArbitrageOpportunity } = require('./simple');
const { broadcastLog } = require('../../utils/logger');

async function findTriangularArbitrage(token1, token2, token3, chainId, network) {
  const path1 = await findArbitrageOpportunity(token1, token2, chainId, network);
  const path2 = await findArbitrageOpportunity(token2, token3, chainId, network);
  const path3 = await findArbitrageOpportunity(token3, token1, chainId, network);
  if (path1 && path2 && path3) {
    broadcastLog(`Triangular arbitrage found: ${token1} -> ${token2} -> ${token3} -> ${token1}`);
    return [path1, path2, path3];
  }
  return null;
}

module.exports = { findTriangularArbitrage };
