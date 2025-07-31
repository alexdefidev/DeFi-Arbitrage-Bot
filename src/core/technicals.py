import pandas as pd
import pandas_ta as ta

def calculate_rsi(prices: list, period: int = 14) -> float:
    """Calculate Relative Strength Index (RSI)."""
    df = pd.DataFrame(prices, columns=["close"])
    rsi = ta.rsi(df["close"], length=period)
    return rsi.iloc[-1]

def calculate_macd(prices: list, fast: int = 12, slow: int = 26, signal: int = 9) -> tuple:
    """Calculate MACD and signal line."""
    df = pd.DataFrame(prices, columns=["close"])
    macd = ta.macd(df["close"], fast=fast, slow=slow, signal=signal)
    return macd["MACD_12_26_9"].iloc[-1], macd["MACDs_12_26_9"].iloc[-1]

def calculate_bollinger_bands(prices: list, period: int = 20, std: float = 2.0) -> tuple:
    """Calculate Bollinger Bands."""
    df = pd.DataFrame(prices, columns=["close"])
    bbands = ta.bbands(df["close"], length=period, std=std)
    return bbands["BBU_20_2.0"].iloc[-1], bbands["BBL_20_2.0"].iloc[-1]
