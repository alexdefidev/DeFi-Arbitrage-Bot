require('dotenv').config();

const config = {
  networks: {
    ethereum: {
      rpc: process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      chainId: 1,
      dex: ['UniswapV3', 'UniswapV4', 'Curve'],
      minTVL: 50000000,
    },
    bsc: {
      rpc: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      dex: ['PancakeSwapV3'],
      minTVL: 50000000,
    },
    base: {
      rpc: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      chainId: 8453,
      dex: ['AerodromeFi'],
      minTVL: 50000000,
    },
    solana: {
      rpc: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      jitoRpc: process.env.JITO_RPC_URL || 'https://mainnet-beta.jito.wtf',
      chainId: 'solana',
      dex: ['Raydium'],
      minTVL: 50000000,
    },
  },
  aggregators: {
    oneInch: 'https://api.1inch.exchange/v5.0',
    matcha: 'https://api.matcha.xyz/v1',
  },
  trading: {
    minProfit: 0.005,
    maxSlippage: 0.001,
    gasPriceMultiplier: 1.2,
    maxGasPrice: 80,
    jitoTip: 10000,
    orderSize: 100000,
  },
  tokens: {
    native: ['ETH', 'BNB', 'SOL'],
    stable: ['USDC', 'USDT', 'DAI'],
    meme: [
      { symbol: 'SHIB', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', chain: 'ethereum' },
      { symbol: 'PEPE', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', chain: 'ethereum' },
      { symbol: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', chain: 'solana' },
      { symbol: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', chain: 'solana' },
    ],
  },
  mevProtection: {
    useMatchaAuto: true,
    useFlashbots: true,
    useJito: true,
    privateMempool: true,
  },
  wormhole: {
    bridge: 'https://wormhole-v2-mainnet.api.certus.one/v1',
    solanaTokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    ethereumTokenBridge: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
  },
  contractAddresses: {
    UniswapV3: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    UniswapV4: '0x1f9840a85d5aF5B72077a8F9c8f7a8C4b7c0F0E',
    PancakeSwapV3: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
    Curve: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
    AerodromeFi: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
    Raydium: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  },
};

module.exports = config;
