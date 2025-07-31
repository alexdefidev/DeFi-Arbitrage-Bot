const WebSocket = require('ws');
const config = require('../../config/config');
const { broadcastLog } = require('../../utils/logger');

function monitorMempool(network) {
  if (network === 'solana') {
    const ws = new WebSocket(config.networks.solana.jitoRpc.replace('https', 'wss'));
    ws.on('open', () => {
      broadcastLog('Jito ShredStream monitoring started');
      ws.send(JSON.stringify({ id: 1, method: 'subscribe_shredstream' }));
    });
    ws.on('message', (data) => {
      broadcastLog(`Jito ShredStream: ${data}`);
    });
    return;
  }

  const wsUrl =
    network === 'ethereum'
      ? 'wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'
      : network === 'bsc'
      ? 'wss://bsc-ws-node.nariox.org'
      : 'wss://base-ws-node.example.com';
  const ws = new WebSocket(wsUrl);
  ws.on('open', () => {
    broadcastLog(`Mempool monitoring ${network} started`);
    ws.send(JSON.stringify({ id: 1, method: 'eth_subscribe', params: ['newPendingTransactions'] }));
  });
  ws.on('message', (data) => {
    const tx = JSON.parse(data);
    if (tx.method === 'eth_subscription') {
      broadcastLog(`Mempool transaction detected: ${tx.params.result}`);
    }
  });
}

module.exports = { monitorMempool };
