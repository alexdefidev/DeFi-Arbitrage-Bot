const { broadcastLog } = require('./logger');

function handleError(error, context) {
  broadcastLog(`Error in ${context}: ${error.message}`);
}

module.exports = { handleError };
