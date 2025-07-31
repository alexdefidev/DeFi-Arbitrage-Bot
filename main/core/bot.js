const { findArbitrageOpportunity } = require('../../strategies/arbitrage/simple');
const { executeArbitrageEVM } = require('../../core/dex/evm');
const { executeArbitrageSolana } = require('../../core/dex/solana');
const { monitorMempool } = require('../../core/chains/mempool');
const { addMemeCoin } = require('../../core/tokens/tokens');
const config = require('../../config/config');

async function startBot() {
  await addMemeCoin('NEIRO', '0x812ba41e071c7b7fa4d46a1839f9e6031c0b655d', 'ethereum');
  await addMemeCoin('DOGS', 'HNbhC3XPUHL3uVszg7N3XjG5e2v1G95xT2q3u8o8SF8J', 'solana');

  for (const network in config.networks) {
    const { chainId, dex } = config.networks[network];
    const tokens = [
      ...config.tokens.native,
      ...config.tokens.stable,
      ...config.tokens.meme.filter(t => t.chain === network).map(t => t.address),
    ];

    for (const tokenIn of tokens) {
      for (const tokenOut of tokens) {
        if (tokenIn === tokenOut) continue;

        const opportunity = await findArbitrageOpportunity(tokenIn, tokenOut, chainId, network);
        if (opportunity) {
          if (opportunity.crossChain) {
            console.log(`Cross-chain arbitrage: ${network} -> ${opportunity.crossChain} (order size: $${config.trading.orderSize})`);
          }
          if (network === 'solana') {
            await executeArbitrageSolana(opportunity);
          } else {
            await executeArbitrageEVM(opportunity, network);
          }
        }
      }
    }

    monitorMempool(network);
  }
}

module.exports = { startBot };
