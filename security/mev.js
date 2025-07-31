const axios = require('axios');
const config = require('../config/config');
const { broadcastLog } = require('../utils/logger');

async function sendToFlashbots(signedTx, network) {
  if (network !== 'ethereum') return false;
  try {
    await axios.post('https://relay.flashbots.net', {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_sendBundle',
      params: [{ txs: [signedTx.rawTransaction] }],
    });
    broadcastLog('Flashbots transaction sent');
    return true;
  } catch (error) {
    broadcastLog(`Flashbots error: ${error.message}`);
    return false;
  }
}

async function sendToMatcha(signedTx) {
  try {
    await axios.post(`${config.aggregators.matcha}/submit`, {
      transaction: signedTx.rawTransaction,
      privateMempool: config.mevProtection.privateMempool,
    });
    broadcastLog('Matcha transaction sent');
    return true;
  } catch (error) {
    broadcastLog(`Matcha error: ${error.message}`);
    return false;
  }
}

async function sendToJito(signedTx) {
  try {
    const response = await axios.post(`${config.networks.solana.jitoRpc}/api/v1/bundles`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'sendBundle',
      params: [Buffer.from(signedTx.serialize()).toString('base64')],
    });
    broadcastLog(`Jito bundle sent: ${response.data.result}`);
    return true;
  } catch (error) {
    broadcastLog(`Jito error: ${error.message}`);
    return false;
  }
}

module.exports = { sendToFlashbots, sendToMatcha, sendToJito };
