import requests

def monitor_liquidity(token_address, min_liquidity=10000):
    """Monitor pool liquidity via Dexscreener."""
    try:
        response = requests.get(f"https://api.dexscreener.com/latest/dex/tokens/{token_address}")
        pool = response.json()['pairs'][0]
        liquidity_usd = float(pool['liquidity']['usd'])
        return liquidity_usd >= min_liquidity, liquidity_usd
    except Exception as e:
        return False, 0.0
