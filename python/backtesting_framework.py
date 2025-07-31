import pandas as pd

def backtest_strategy(prices, signals, initial_balance=10000):
    """Backtest trading strategy."""
    balance = initial_balance
    position = 0
    trades = []

    for i in range(1, len(prices)):
        if signals[i] == "buy" and position == 0:
            position = balance / prices[i]
            balance = 0
            trades.append(("buy", prices[i], i))
        elif signals[i] == "sell" and position > 0:
            balance = position * prices[i]
            position = 0
            trades.append(("sell", prices[i], i))

    final_balance = balance + position * prices[-1]
    return final_balance, trades
