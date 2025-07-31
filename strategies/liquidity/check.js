const axios = require('axios');
const { broadcastLog } = require('../../utils/logger');
const config = require('../../config/config');

async function checkPoolLiquidity(dex, tokenPair, network) {
  try {
    const response = await axios.get(`https://api.defillama.com/pools/${network}/${dex}`);
    const pool = response.data.find(p => p.token0 === tokenPair[0] && p.token1 === tokenPair[1]);
    return pool && pool.tvlUsd >= config.networks[network].minTVL;
  } catch (error) {
    broadcastLog(`Error checking liquidity ${dex}: ${error.message}`);
    return false;
  }
}

module.exports = { checkPoolLiquidity };
