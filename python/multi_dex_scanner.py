import requests

def scan_multi_dex(min_liquidity=10000, dexes=["raydium", "orca", "pump", "meteora"]):
    """Scan multiple DEX for new pools."""
    try:
        response = requests.get("https://api.dexscreener.com/latest/dex/tokens/")
        pools = response.json()['pairs']
        filtered_pools = [
            pool['baseToken']['address'] for pool in pools
            if pool['chainId'] == 'solana' and
               pool['dexId'] in dexes and
               float(pool['liquidity']['usd']) > min_liquidity
        ]
        return filtered_pools
    except Exception as e:
        print(f"Error scanning DEX: {e}")
        return []
