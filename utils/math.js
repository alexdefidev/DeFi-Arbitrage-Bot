function calculateSpread(buyPrice, sellPrice) {
  return (sellPrice - buyPrice) / buyPrice;
}

module.exports = { calculateSpread };
