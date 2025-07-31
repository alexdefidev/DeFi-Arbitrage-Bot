const { executeArbitrageEVM } = require('./evm');
const config = require('../../config/config');

async function executeCurveTrade(opportunity) {
  await executeArbitrageEVM({ ...opportunity, dex: 'Curve' }, 'ethereum');
}

module.exports = { executeCurveTrade };
