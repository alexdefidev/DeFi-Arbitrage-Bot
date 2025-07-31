const { WebSocketServer } = require('ws');

function broadcastLog(message) {
  const wss = new WebSocketServer({ noServer: true });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  console.log(message);
}

module.exports = { broadcastLog };
