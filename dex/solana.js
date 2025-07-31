const { Liquidity, Token, TokenAmount, Percent } = require('@raydium-io/raydium-sdk');
const { Connection, PublicKey, Transaction, VersionedTransaction, ComputeBudgetProgram } = require('@solana/web3.js');
const { sendToJito } = require('../../security/mev');
const { solanaConnection, jitoConnection } = require('../chains/solana');
const { getSolanaWallet } = require('../../security/wallet');
const config = require('../../config/config');
const { broadcastLog } = require('../../utils/logger');

async function executeArbitrageSolana(opportunity) {
  const { buyOn, sellOn, tokenIn, tokenOut, amount, crossChain } = opportunity;
  const wallet = getSolanaWallet();

  try {
    const poolKeys = await Liquidity.fetchPoolKeys(solanaConnection, new PublicKey(config.contractAddresses.Raydium));
    const tokenInObj = new Token(new PublicKey(tokenIn), 9);
    const tokenOutObj = new Token(new PublicKey(tokenOut), 9);
    const poolInfo = await Liquidity.fetchInfo({ connection: solanaConnection, poolKeys });
    const amountIn = new TokenAmount(tokenInObj, amount);
    const { transaction, signers } = await Liquidity.makeSwapInstructionSimple({
      connection: solanaConnection,
      poolKeys,
      userKeys: { owner: wallet.publicKey, payer: wallet.publicKey, tokenAccounts: [] },
      amountIn,
      currencyOut: tokenOutObj,
      slippage: new Percent(Math.floor(config.trading.maxSlippage * 100), 100),
    });

    transaction.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: config.trading.jitoTip }));
    const signedTx = await VersionedTransaction.sign(transaction, [wallet, ...signers]);

    if (config.mevProtection.useJito) {
      await sendToJito(signedTx);
    } else {
      const txId = await jitoConnection.sendRawTransaction(signedTx.serialize());
      await jitoConnection.confirmTransaction(txId);
      broadcastLog(`Solana arbitrage: Bought on ${buyOn}, sold on ${sellOn}, TX: ${txId} (order size: $${amount})`);
    }

    if (crossChain) {
      const { bridgeToken } = require('../../strategies/crosschain/wormhole');
      await bridgeToken(tokenIn, amount, 'solana', crossChain);
    }
  } catch (error) {
    broadcastLog(`Solana arbitrage error: ${error.message}`);
  }
}

module.exports = { executeArbitrageSolana };
