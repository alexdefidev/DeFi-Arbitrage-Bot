const Web3 = require('web3');
const { getWeb3Instance } = require('../chains/ethereum');
const { sendToFlashbots, sendToMatcha } = require('../../security/mev');
const config = require('../../config/config');
const { broadcastLog } = require('../../utils/logger');

const uniswapV3ABI = [
  {
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'fee', type: 'uint24' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMinimum', type: 'uint256' },
    ],
    name: 'exactInputSingle',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
];

async function executeArbitrageEVM(opportunity, network) {
  const { buyOn, sellOn, tokenIn, tokenOut, amount, dex } = opportunity;
  const web3 = network === 'ethereum' ? getWeb3Instance() : require(`../chains/${network}`).getWeb3Instance();
  const { privateKey, walletAddress } = require('../../security/wallet').getEvmWallet();

  try {
    const contract = new web3.eth.Contract(uniswapV3ABI, config.contractAddresses[dex]);
    const amountOutMin = amount * (1 - config.trading.maxSlippage);
    const gasPrice = Math.min(
      web3.utils.toWei(config.trading.maxGasPrice.toString(), 'gwei'),
      (await web3.eth.getGasPrice()) * config.trading.gasPriceMultiplier
    );

    const tx = contract.methods.exactInputSingle(
      tokenIn,
      tokenOut,
      3000,
      web3.utils.toWei(amount.toString(), 'ether'),
      web3.utils.toWei(amountOutMin.toString(), 'ether')
    );

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: config.contractAddresses[dex],
        data: tx.encodeABI(),
        gas: 2000000,
        gasPrice,
        nonce: await web3.eth.getTransactionCount(walletAddress),
      },
      privateKey
    );

    if (web3.utils.isHexStrict(signedTx.rawTransaction)) {
      if (config.mevProtection.useMatchaAuto) {
        await sendToMatcha(signedTx);
      } else if (config.mevProtection.useFlashbots && network === 'ethereum') {
        await sendToFlashbots(signedTx, network);
      } else {
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      }
      broadcastLog(`EVM arbitrage: Bought on ${buyOn}, sold on ${sellOn}, profit: ${opportunity.profit} USD (order size: $${amount})`);
    } else {
      broadcastLog(`Invalid transaction format for ${buyOn} -> ${sellOn}`);
    }
  } catch (error) {
    broadcastLog(`EVM arbitrage error: ${error.message}`);
  }
}

module.exports = { executeArbitrageEVM };
