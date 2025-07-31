const fs = require('fs/promises');

async function loadConfig() {
  try {
    const config = require('../config/config');
    return config;
  } catch (error) {
    console.error(`Error loading config: ${error.message}`);
    throw error;
  }
}

module.exports = { loadConfig };
