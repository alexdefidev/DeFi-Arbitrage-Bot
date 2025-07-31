def calculate_ema(prices, period):
    """Calculate Exponential Moving Average (EMA)."""
    ema = [prices[0]]
    k = 2 / (period + 1)
    for price in prices[1:]:
        ema.append(price * k + ema[-1] * (1 - k))
    return ema
