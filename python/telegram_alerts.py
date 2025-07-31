from telegram import Bot
import asyncio

async def send_telegram_alert(token: str, chat_id: str, message: str):
    """Send trade alert to Telegram."""
    try:
        bot = Bot(token=token)
        await bot.send_message(chat_id=chat_id, text=message)
    except Exception as e:
        print(f"Error sending Telegram alert: {e}")
