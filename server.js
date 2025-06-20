const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
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
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket Server running on port ${PORT}`);
});