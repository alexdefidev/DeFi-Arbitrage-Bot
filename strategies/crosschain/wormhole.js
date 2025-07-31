const { Wormhole, getSignedVAA } = require('@wormhole-foundation/sdk');
const { SolanaChain, EthereumChain } = require('@wormhole-foundation/sdk');
const { PublicKey } = require('@solana/web3.js');
const { broadcastLog } = require('../../utils/logger');
const config = require('../../config/config');

let wormhole;

async function initWormhole() {
  try {
    wormhole = new Wormhole('Mainnet', [
      new SolanaChain({ rpcUrl: config.networks.solana.rpc }),
      new EthereumChain({ rpcUrl: config.networks.ethereum.rpc }),
    ]);
    broadcastLog('Wormhole initialized successfully');
  } catch (error) {
    broadcastLog(`Wormhole initialization failed: ${error.message}`);
    throw error;
  }
}

async function bridgeToken(token, amount, fromChain, toChain) {
  try {
    const sourceWallet = fromChain === 'solana' ? new PublicKey(process.env.SOLANA_WALLET) : process.env.WALLET_ADDRESS;
    const tx = await wormhole.transfer({
      amount,
      token,
      sourceChain: fromChain,
      destinationChain: toChain,
      sourceAddress: sourceWallet,
      destinationAddress: toChain === 'solana' ? new PublicKey(process.env.SOLANA_WALLET) : process.env.WALLET_ADDRESS,
    });
    const vaa = await getSignedVAA(tx);
    broadcastLog(`Wormhole: Transferred ${amount} ${token} from ${fromChain} to ${toChain}, VAA: ${vaa}`);
    return vaa;
  } catch (error) {
    broadcastLog(`Wormhole error: ${error.message}`);
    return null;
  }
}

module.exports = { initWormhole, bridgeToken };
