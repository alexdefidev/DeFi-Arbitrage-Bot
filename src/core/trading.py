import asyncio
from solana.rpc.async_api import AsyncClient
from src.dex.raydium import raydium_swap
from src.dex.orca import orca_swap
from src.core.technicals import calculate_rsi, calculate_macd, calculate_bollinger_bands
from src.utils.api import fetch_pool_data
from src.core.notifications import send_telegram_notification

async def trading_loop(rpc_endpoint: str, wallet: dict, dex: str = "raydium"):
    """Main trading loop for executing automated trades."""
    client = AsyncClient(rpc_endpoint)
    
    while True:
        try:
            pools = await fetch_pool_data(dex)
            for pool in pools:
                price_data = pool['price_data']
                
                # Calculate technical indicators
                rsi = calculate_rsi(price_data)
                macd, signal = calculate_macd(price_data)
                upper_band, lower_band = calculate_bollinger_bands(price_data)
                
                # Trading signals
                if rsi < 20 and price_data[-1] < lower_band:
                    amount = wallet['balance'] * 0.1  # 10% of balance
                    if dex == "raydium":
                        await raydium_swap(client, wallet, pool['token_address'], amount, "buy")
                    elif dex == "orca":
                        await orca_swap(client, wallet, pool['token_address'], amount, "buy")
                    await send_telegram_notification(f"Bought {pool['token_address']} at {price_data[-1]}")
                
                await asyncio.sleep(300)  # Scan every 5 minutes
        
        except Exception as e:
            print(f"Trading error: {str(e)}")
            await asyncio.sleep(60)

if __name__ == "__main__":
    wallet = {"public_key": "your_public_key", "private_key": "your_private_key", "balance": 10.0}
    asyncio.run(trading_loop("https://api.mainnet-beta.solana.com", wallet))
