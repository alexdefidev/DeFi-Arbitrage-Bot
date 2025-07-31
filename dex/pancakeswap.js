const { executeArbitrageEVM } = require('./evm');
const config = require('../../config/config');

async function executePancakeSwapTrade(opportunity) {
  await executeArbitrageEVM({ ...opportunity, dex: 'PancakeSwapV3' }, 'bsc');
}

module.exports = { executePancakeSwapTrade };
