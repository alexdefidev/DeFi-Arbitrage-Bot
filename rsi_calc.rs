/// Calculate Relative Strength Index (RSI) for price data
pub fn calculate_rsi(prices: &[f64], period: usize) -> Vec<f64> {
    let mut rsi = vec![0.0; prices.len()];
    if prices.len() < period + 1 {
        return rsi;
    }

    let mut gains = 0.0;
    let mut losses = 0.0;

    // Calculate initial gains and losses
    for i in 1..=period {
        let diff = prices[i] - prices[i - 1];
        if diff > 0.0 {
            gains += diff;
        } else {
            losses -= diff;
        }
    }

    let mut avg_gain = gains / period as f64;
    let mut avg_loss = losses / period as f64;
    rsi[period] = 100.0 - (100.0 / (1.0 + avg_gain / avg_loss));

    // Calculate subsequent RSI values
    for i in period + 1..prices.len() {
        let diff = prices[i] - prices[(i - 1)];
        let gain = if diff > 0.0 { diff } else { 0.0 };
        let loss = if diff < 0.0 { -diff } else { 0.0 };

        avg_gain = (avg_gain * (period as f64 - 1.0 + gain) / period as f64;
        avg_loss = (avg_loss * (period as f64 - 1.0) + loss) / period as f64;
        rsi[i] = 100.0 - (100.0 / (1.0 + avg_gain / avg_loss));
    }

    rsi
}
