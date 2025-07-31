const axios = require('axios');
const { checkPoolLiquidity } = require('../../core/dex/liquidity');
const config = require('../../config/config');
const { broadcastLog } = require('../../utils/logger');

async function get1inchPrice(tokenIn, tokenOut, amount, chainId) {
  if (chainId === 'solana') return null;
  const url = `${config.aggregators.oneInch}/${chainId}/quote?fromTokenAddress=${tokenIn}&toTokenAddress=${tokenOut}&amount=${amount}`;
  try {
    const response = await axios.get(url);
    return response.data.toTokenAmount / 10 ** 18;
  } catch (error) {
    broadcastLog(`Error 1inch API: ${error.message}`);
    return null;
  }
}

async function getMatchaPrice(tokenIn, tokenOut, amount, chainId) {
  const url = `${config.aggregators.matcha}/quote?fromToken=${tokenIn}&toToken=${tokenOut}&amount=${amount}&chainId=${chainId}`;
  try {
    const response = await axios.get(url);
    return response.data.toTokenAmount / 10 ** 18;
  } catch (error) {
    broadcastLog(`Error Matcha API: ${error.message}`);
    return null;
  }
}

async function getRaydiumPrice(tokenIn, tokenOut, amount) {
  const { Liquidity, Token, TokenAmount, Percent } = require('@raydium-io/raydium-sdk');
  const { PublicKey } = require('@solana/web3.js');
  const { solanaConnection } = require('../../core/chains/solana');

  try {
    const poolKeys = await Liquidity.fetchPoolKeys(solanaConnection, new PublicKey(config.contractAddresses.Raydium));
    const tokenInObj = new Token(new PublicKey(tokenIn), 9);
    const tokenOutObj = new Token(new PublicKey(tokenOut), 9);
    const poolInfo = await Liquidity.fetchInfo({ connection: solanaConnection, poolKeys });
    const amountIn = new TokenAmount(tokenInObj, amount);
    const amountOut = Liquidity.computeAmountOut({
      poolKeys,
      poolInfo,
      amountIn,
      currencyOut: tokenOutObj,
      slippage: new Percent(Math.floor(config.trading.maxSlippage * 100), 100),
    });
    return amountOut-amountOut.raw / 10 ** 9;
  } catch (error) {
    broadcastLog(`Error Raydium API: ${error.message}`);
    return null;
  }
}

async function findArbitrageOpportunity(tokenIn, tokenOut, chainId, network) {
  const amount = config.trading.orderSize;
  const prices = [];
  if (network !== 'solana') {
    const oneInchPrice = await get1inchPrice(tokenIn, tokenOut, amount, chainId);
    const matchaPrice = await getMatchaPrice(tokenIn, tokenOut, amount, chainId);
    if (oneInchPrice) prices.push({ aggregator: '1inch', price: oneInchPrice });
    if (matchaPrice) prices.push({ aggregator: 'Matcha', price: matchaPrice });
  } else {
    const raydiumPrice = await getRaydiumPrice(tokenIn, tokenOut, amount);
    if (raydiumPrice) prices.push({ aggregator: 'Raydium', price: raydiumPrice });
  }

  if (prices.length < 2 && network !== 'solana') return null;

  const dexList = config.networks[network].dex;
  for (const dex of dexList) {
    if (!(await checkPoolLiquidity(dex, [tokenIn, tokenOut], network))) continue;

    const { aggregator: buyOn, price: buyPrice } = prices.reduce((min, p) => (p.price < min.price ? p : min), prices[0]);
    const { aggregator: sellOn, price: sellPrice } = prices.reduce((max, p) => (p.price > max.price ? p : max), prices[0]);

    const spread = (sellPrice - buyPrice) / buyPrice;
    if (spread >= config.trading.minProfit) {
      return {
        buyOn,
        sellOn,
        profit: spread * amount,
        tokenIn,
        tokenOut,
        amount,
        dex,
        network,
      };
    }
  }

  if (network === 'solana' || network === 'ethereum') {
    const crossChain = network === 'solana' ? 'ethereum' : 'solana';
    const crossPrice = network === 'solana' ? await get1inchPrice(tokenIn, tokenOut, amount, 1) : await getRaydiumPrice(tokenIn, tokenOut, amount);
    if (crossPrice) {
      const spread = (crossPrice - prices[0].price) / prices[0].price;
      if (spread >= config.trading.minProfit) {
        return {
          buyOn: prices[0].aggregator,
          sellOn: network === 'solana' ? '1inch' : 'Raydium',
          profit: spread * amount,
          tokenIn,
          tokenOut,
          amount,
          dex: network === 'solana' ? 'UniswapV3' : 'Raydium',
          network,
          crossChain,
        };
      }
    }
  }
  return null;
}

module.exports = { findArbitrageOpportunity };
