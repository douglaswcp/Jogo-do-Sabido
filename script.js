const dados = {
  "Vermelho": [2, 20, 11, 24, 8, 16],
  "Azul": [3, 18, 10, 21, 5, 13],
  "Amarelo": [1, 6, 12, 14, 17, 22],
  "Verde": [4, 9, 7, 15, 19, 7]
};

const cores = {
  "Vermelho": "#ff4c4c",
  "Azul": "#4c6aff",
  "Amarelo": "#ffd633",
  "Verde": "#33cc33"
};

document.getElementById("rollBtn").addEventListener("click", () => {
  const jogada = Object.entries(dados).map(([cor, valores]) => {
    const valor = valores[Math.floor(Math.random() * valores.length)];
    return [cor, valor];
  }).sort((a, b) => b[1] - a[1]);

  animarDados3D(jogada);
  mostrarResultado(jogada);
});

function mostrarResultado(jogada) {
  const div = document.getElementById("resultado");
  div.innerHTML = "<h3>Resultado:</h3>" + jogada.map(([cor, valor]) =>
    `<div style="display:inline-block;width:70px;height:70px;background:${cores[cor]};
    margin:5px;border-radius:12px;display:flex;align-items:center;justify-content:center;
    font-weight:bold;">${valor}</div>`).join("");
}

function animarDados3D(jogada) {
  const container = document.getElementById("sceneContainer");
  container.innerHTML = ""; // limpa cena anterior

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9.5);
  scene.add(camera);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(3, 5, 6);
  scene.add(dir);

  function makeFaceTexture(color, text) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);
    const tex = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: tex });
  }

  function makeDie(cor, valores) {
    const mats = valores.map(v => makeFaceTexture(cores[cor], v));
    while (mats.length < 6) mats.push(mats[0]);
    const geom = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    return new THREE.Mesh(geom, mats);
  }

  const dice = [];
  const spacing = 2.4;
  const startX = -((jogada.length - 1) * spacing) / 2;

  jogada.forEach(([cor, valor], i) => {
    const die = makeDie(cor, dados[cor]);
    die.position.set(startX + i * spacing, 0, 0);
    scene.add(die);
    dice.push({ mesh: die, cor, alvo: valor });
  });

  const clock = new THREE.Clock();
  let elapsed = 0;
  const rollDuration = 1.4;
  const settleDuration = 0.5;
  let phase = 'roll';

  function animate() {
    const dt = clock.getDelta();
    elapsed += dt;

    if (phase === 'roll') {
      dice.forEach(d => {
        d.mesh.rotation.x += 3 * dt;
        d.mesh.rotation.y += 3 * dt;
      });
      if (elapsed >= rollDuration) {
        phase = 'settle';
        elapsed = 0;
      }
    } else if (phase === 'settle') {
      const t = Math.min(elapsed / settleDuration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      dice.forEach(d => {
        d.mesh.rotation.x *= (1 - ease);
        d.mesh.rotation.y *= (1 - ease);
      });
      if (t >= 1) phase = 'stopped';
    }

    renderer.render(scene, camera);
    if (phase !== 'stopped') requestAnimationFrame(animate);
  }

  animate();
}
apps-fileview.texmex_20250814.00_p1
script.txt
Exibindo script.txt…
