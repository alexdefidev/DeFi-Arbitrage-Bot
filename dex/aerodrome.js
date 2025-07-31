const { executeArbitrageEVM } = require('./evm');
const config = require('../../config/config');

async function executeAerodromeTrade(opportunity) {
  await executeArbitrageEVM({ ...opportunity, dex: 'AerodromeFi' }, 'base');
}

module.exports = { executeAerodromeTrade };
