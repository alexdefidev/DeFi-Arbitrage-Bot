const Web3 = require('web3');
const config = require('../../config/config');

const web3 = new Web3(config.networks.bsc.rpc);

function getWeb3Instance() {
  return web3;
}

module.exports = { getWeb3Instance };
