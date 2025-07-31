const express = require('express');
const { setupApi } = require('../bot/services/api');

async function startServer() {
  await setupApi();
}

module.exports = { startServer };
