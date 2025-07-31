/// Calculate Volume Weighted Average Price (VWAP)
pub fn calculate_vwap(prices: &[f64], volumes: &[f64]) -> Vec<f64> {
    let mut vwap = vec![0.0; prices.len()];
    let mut cumulative_price_volume = 0.0;
    let mut cumulative_volume = 0.0;

    for i in 0..prices.len() {
        cumulative_price_volume += prices[i] * volumes[i];
        cumulative_volume += volumes[i];
        vwap[i] = if cumulative_volume > 0.0 {
            cumulative_price_volume / cumulative_volume
        } else {
            0.0
        };
    }
    vwap
}
