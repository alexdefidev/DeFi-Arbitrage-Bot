import pandas as pd
import pandas_ta as ta

def calculate_bollinger_bands(prices, period=20, std_dev=2):
    """Calculate Bollinger Bands."""
    df = pd.DataFrame({'close': prices})
    bbands = ta.bbands(df['close'], length=period, std=std_dev)
    return {
        'upper': bbands[f'BBU_{period}_{std_dev}.0'].tolist(),
        'middle': bbands[f'BBM_{period}_{std_dev}.0'].tolist(),
        'lower': bbands[f'BBL_{period}_{std_dev}.0'].tolist()
    }
