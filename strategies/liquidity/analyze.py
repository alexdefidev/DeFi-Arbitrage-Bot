import requests
from config import config
from utils.logger import broadcast_log

def analyze_liquidity(dex, token_pair, network):
    try:
        response = requests.get(f"https://api.defillama.com/pools/{network}/{dex}")
        pool = next((p for p in response.json() if p['token0'] == token_pair[0] and p['token1'] == token_pair[1]), None)
        if pool:
            broadcast_log(f"Liquidity analysis for {dex}: TVL {pool['tvlUsd']} USD")
            return pool['tvlUsd']
        return 0
    except Exception as e:
        broadcast_log(f"Error analyzing liquidity {dex}: {str(e)}")
        return 0
