const { executeArbitrageEVM } = require('./evm');
const config = require('../../config/config');

async function executeUniswapTrade(opportunity) {
  await executeArbitrageEVM({ ...opportunity, dex: 'UniswapV3' }, 'ethereum');
}

module.exports = { executeUniswapTrade };
