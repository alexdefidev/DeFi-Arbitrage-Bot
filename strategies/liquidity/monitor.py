import requests
from config import config
from utils.logger import broadcast_log

def monitor_liquidity(dex, token_pair, network):
    try:
        response = requests.get(f"https://api.defillama.com/pools/{network}/{dex}")
        pool = next((p for p in response.json() if p['token0'] == token_pair[0] and p['token1'] == token_pair[1]), None)
        if pool and pool['tvlUsd'] >= config['networks'][network]['minTVL']:
            broadcast_log(f"Liquidity sufficient for {dex}: {pool['tvlUsd']} USD")
            return True
        return False
    except Exception as e:
        broadcast_log(f"Error monitoring liquidity {dex}: {str(e)}")
        return False
