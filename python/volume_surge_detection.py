import requests

def detect_volume_surge(token_address, threshold=2.0):
    """Detect volume surges on DEX."""
    try:
        response = requests.get(f"https://api.dexscreener.com/latest/dex/tokens/{token_address}")
        pool = response.json()['pairs'][0]
        volume_h1 = float(pool['volume']['h1'])
        volume_h6 = float(pool['volume']['h6'])
        return volume_h1 / volume_h6 > threshold, volume_h1
    except Exception as e:
        return False, 0.0
