const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const id = Math.random().toString(36).substr(2, 9);
let players = {};
let x = Math.random() * canvas.width;
let y = Math.random() * canvas.height;

const socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

socket.addEventListener("open", () => {
  sendPosition();
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  players = data;
});

function sendPosition() {
  socket.send(JSON.stringify({ id, x, y }));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") y -= 10;
  if (e.key === "ArrowDown") y += 10;
  if (e.key === "ArrowLeft") x -= 10;
  if (e.key === "ArrowRight") x += 10;
  sendPosition();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let pid in players) {
    const p = players[pid];
    ctx.fillStyle = pid === id ? "#00ff00" : "#ffffff";
    ctx.fillRect(p.x, p.y, 20, 20);
  }
  requestAnimationFrame(draw);
}
draw();