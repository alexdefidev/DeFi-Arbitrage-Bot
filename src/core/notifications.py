from python_telegram_bot import Bot
from src.utils.config import load_config

async def send_telegram_notification(message: str):
    """Send trade notifications via Telegram."""
    config = load_config()
    bot = Bot(token=config['telegram_token'])
    await bot.send_message(chat_id=config['telegram_chat_id'], text=message)

def log_trade(message: str):
    """Log trade details to CSV."""
    import pandas as pd
    from datetime import datetime
    log_entry = {"timestamp": datetime.now(), "message": message}
    df = pd.DataFrame([log_entry])
    df.to_csv("trading_bot_logs.csv", mode="a", index=False)
