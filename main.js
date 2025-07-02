const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let brushSize = 5;
let isDrawing = false;
let currentMaterial = 1;
let isPaused = false;

canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = GRID_HEIGHT * CELL_SIZE;

function render() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const idx = getIndex(x, y);
      const material = materials[grid[idx]];
      const [r, g, b] = material.color;

      for (let dx = 0; dx < CELL_SIZE; dx++) {
        for (let dy = 0; dy < CELL_SIZE; dy++) {
          const px = (y * CELL_SIZE + dy) * canvas.width + (x * CELL_SIZE + dx);
          const i = px * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function placeMaterial(x, y, material) {
  const cx = Math.floor(x / CELL_SIZE);
  const cy = Math.floor(y / CELL_SIZE);
  for (let dx = -brushSize; dx <= brushSize; dx++) {
    for (let dy = -brushSize; dy <= brushSize; dy++) {
      const nx = cx + dx, ny = cy + dy;
      if (isValid(nx, ny)) grid[getIndex(nx, ny)] = material;
    }
  }
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  placeMaterial(e.clientX - rect.left, e.clientY - rect.top, currentMaterial);
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    const rect = canvas.getBoundingClientRect();
    placeMaterial(e.clientX - rect.left, e.clientY - rect.top, currentMaterial);
  }
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

document.querySelectorAll('.material-btn[data-material]').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    document.querySelector('.material-btn.active')?.classList.remove('active');
    btn.classList.add('active');
    currentMaterial = i + 1;
  });
});

document.getElementById('brushSize').addEventListener('input', (e) => {
  brushSize = +e.target.value;
  document.getElementById('brushSizeDisplay').textContent = brushSize;
});

document.getElementById('clearBtn').addEventListener('click', () => {
  grid.fill(0);
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
});

function loop() {
  if (!isPaused) updatePhysics();
  render();
  requestAnimationFrame(loop);
}

loop();
