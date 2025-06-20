const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

const id = Math.random().toString(36).substring(2, 9);
let players = {};

const localBox = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
scene.add(localBox);
camera.position.z = 5;

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  players = data;
});

function sendPosition() {
  socket.send(JSON.stringify({ id, x: localBox.position.x, y: localBox.position.y }));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") localBox.position.y += 0.1;
  if (e.key === "ArrowDown") localBox.position.y -= 0.1;
  if (e.key === "ArrowLeft") localBox.position.x -= 0.1;
  if (e.key === "ArrowRight") localBox.position.x += 0.1;
  sendPosition();
});

const otherBoxes = {};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  for (const pid in players) {
    if (pid === id) continue;
    if (!otherBoxes[pid]) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      scene.add(box);
      otherBoxes[pid] = box;
    }
    otherBoxes[pid].position.x = players[pid].x;
    otherBoxes[pid].position.y = players[pid].y;
  }
}
animate();
sendPosition();