const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const socket = new WebSocket(location.origin.replace(/^http/, 'ws'));
const id = Math.random().toString(36).substring(2, 9);
let players = {};
const others = {};

let localPlayer;

loader.load("player.glb", (gltf) => {
  localPlayer = gltf.scene;
  localPlayer.scale.set(0.5, 0.5, 0.5);
  scene.add(localPlayer);
  sendPosition();
});

camera.position.z = 5;

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  players = data;
});

function sendPosition() {
  if (!localPlayer) return;
  socket.send(JSON.stringify({ id, x: localPlayer.position.x, y: localPlayer.position.y }));
}

document.addEventListener("keydown", (e) => {
  if (!localPlayer) return;
  if (e.key === "ArrowUp") localPlayer.position.y += 0.1;
  if (e.key === "ArrowDown") localPlayer.position.y -= 0.1;
  if (e.key === "ArrowLeft") localPlayer.position.x -= 0.1;
  if (e.key === "ArrowRight") localPlayer.position.x += 0.1;
  sendPosition();
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  for (let pid in players) {
    if (pid === id) continue;
    if (!others[pid]) {
      loader.load("player.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model);
        others[pid] = model;
      });
    } else {
      others[pid].position.x = players[pid].x;
      others[pid].position.y = players[pid].y;
    }
  }
}
animate();