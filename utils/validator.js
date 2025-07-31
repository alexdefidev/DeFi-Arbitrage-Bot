function validateOrderSize(orderSize) {
  return typeof orderSize === 'number' && orderSize >= 10 && orderSize <= 10000000;
}

module.exports = { validateOrderSize };
