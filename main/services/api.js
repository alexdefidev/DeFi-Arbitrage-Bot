const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const { addMemeCoin } = require('../../core/tokens/tokens');
const { broadcastLog } = require('../../utils/logger');
const config = require('../../config/config');
const fs = require('fs/promises');
const Web3 = require('web3');
const { PublicKey } = require('@solana/web3.js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('close', () => console.log('WebSocket client disconnected'));
});

function setupApi() {
  app.post('/start', (req, res) => {
    res.json({ status: 'Running' });
  });

  app.post('/stop', (req, res) => {
    broadcastLog('Bot stopped');
    res.json({ status: 'Stopped' });
  });

  app.post('/add-meme-coin', async (req, res) => {
    const { symbol, address, chain } = req.body;
    await addMemeCoin(symbol, address, chain);
    res.json({ status: 'Meme coin added' });
  });

  app.post('/update-contract-addresses', async (req, res) => {
    const { aerodromeFi, raydium } = req.body;
    try {
      if (aerodromeFi && Web3.utils.isAddress(aerodromeFi)) {
        config.contractAddresses.AerodromeFi = aerodromeFi;
        broadcastLog(`Updated AerodromeFi address: ${aerodromeFi}`);
      }
      if (raydium && /^[A-Za-z0-9]+$/.test(raydium)) {
        config.contractAddresses.Raydium = raydium;
        broadcastLog(`Updated Raydium address: ${raydium}`);
      }
      res.json({ status: 'Contract addresses updated' });
    } catch (error) {
      broadcastLog(`Error updating contract addresses: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/update-order-size', async (req, res) => {
    const { orderSize } = req.body;
    try {
      if (typeof orderSize !== 'number' || orderSize < 10 || orderSize > 10000000) {
        throw new Error('Order size must be between $10 and $10,000,000');
      }
      config.trading.orderSize = orderSize;
      broadcastLog(`Updated order size: $${orderSize}`);
      res.json({ status: 'Order size updated' });
    } catch (error) {
      broadcastLog(`Error updating order size: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/update-env', async (req, res) => {
    const envVars = req.body;
    try {
      const envContent = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      await fs.writeFile('.env', envContent);
      require('dotenv').config();
      broadcastLog('Environment configuration updated');
      res.json({ status: 'Environment updated' });
    } catch (error) {
      broadcastLog(`Error updating .env: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  });

  server.listen(8080, () => console.log('Server running on port 8080'));
}

module.exports = { setupApi };
