import asyncio
import requests
from solana.rpc.async_api import AsyncClient
from src.utils.api import fetch_pumpfun_pools
from src.core.trading import execute_market_order
from src.utils.config import load_config

async def snipe_new_tokens(rpc_endpoint: str, min_liquidity: float = 10000, max_holders: int = 20):
    """Snipe new token launches on Pump.fun with liquidity and holder checks."""
    config = load_config()
    client = AsyncClient(rpc_endpoint)
    
    while True:
        try:
            # Fetch new pools from Pump.fun via Bitquery API
            pools = await fetch_pumpfun_pools(min_liquidity)
            for pool in pools:
                token_address = pool['token_address']
                liquidity_usd = pool['liquidity_usd']
                holders = pool['holder_count']
                
                # Filter out potential honeypots
                if holders > max_holders:
                    print(f"Sniping token {token_address} with ${liquidity_usd} liquidity")
                    await execute_market_order(client, config['wallet'], token_address, amount=config['snipe_amount'])
                    print(f"Sniped {token_address} successfully")
        
        except Exception as e:
            print(f"Error in sniping: {str(e)}")
        
        await asyncio.sleep(60)  # Check every minute

if __name__ == "__main__":
    asyncio.run(snipe_new_tokens("https://api.mainnet-beta.solana.com"))
