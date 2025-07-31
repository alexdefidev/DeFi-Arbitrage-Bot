const { Connection } = require('@solana/web3.js');
const config = require('../../config/config');

const solanaConnection = new Connection(config.networks.solana.rpc);
const jitoConnection = new Connection(config.networks.solana.jitoRpc);

module.exports = { solanaConnection, jitoConnection };
