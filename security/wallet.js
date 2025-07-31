const { Keypair } = require('@solana/web3.js');
const Web3 = require('web3');

function getEvmWallet() {
  const privateKey = process.env.PRIVATE_KEY;
  const walletAddress = process.env.WALLET_ADDRESS;
  if (!privateKey || !walletAddress || !Web3.utils.isAddress(walletAddress)) {
    throw new Error('Invalid EVM wallet configuration');
  }
  return { privateKey, walletAddress };
}

function getSolanaWallet() {
  const privateKey = Buffer.from(process.env.SOLANA_PRIVATE_KEY, 'base64');
  const wallet = Keypair.fromSecretKey(privateKey);
  if (!wallet.publicKey.toBase58()) {
    throw new Error('Invalid Solana wallet configuration');
  }
  return wallet;
}

module.exports = { getEvmWallet, getSolanaWallet };
