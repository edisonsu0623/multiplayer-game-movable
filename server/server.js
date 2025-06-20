const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const players = {};

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    players[data.id] = { x: data.x, y: data.y };
    const snapshot = JSON.stringify(players);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(snapshot);
      }
    });
  });

  ws.on("close", () => {
    // 若要清除離線玩家，可自行補上清除邏輯
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log("✅ WebSocket Server running on http://localhost:3000");
});
