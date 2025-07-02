const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = GRID_HEIGHT * CELL_SIZE;

let currentMaterial = 1; // default sand
let brushSize = 5;
let isDrawing = false;

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

// Draw circle brush with overlap so dragging creates continuous lines
function placeMaterial(x, y, material) {
  const centerX = x / CELL_SIZE;
  const centerY = y / CELL_SIZE;

  const r = brushSize;
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      if (dx*dx + dy*dy <= r*r) {
        const nx = Math.floor(centerX + dx);
        const ny = Math.floor(centerY + dy);
        if (isValid(nx, ny)) {
          grid[getIndex(nx, ny)] = material;
          if (material === 5) { // fire life initialization
            life[getIndex(nx, ny)] = 40 + Math.floor(Math.random() * 40);
          }
        }
      }
    }
  }
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const { x, y } = getCanvasCoords(e);
  placeMaterial(x, y, currentMaterial);
});
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  const { x, y } = getCanvasCoords(e);
  placeMaterial(x, y, currentMaterial);
});
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseleave', () => { isDrawing = false; });

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isDrawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  placeMaterial((touch.clientX - rect.left) * scaleX, (touch.clientY - rect.top) * scaleY, currentMaterial);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  placeMaterial((touch.clientX - rect.left) * scaleX, (touch.clientY - rect.top) * scaleY, currentMaterial);
});
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  isDrawing = false;
});

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

let isPaused = false;
document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
});

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const idx = getIndex(x, y);
      const materialId = grid[idx];
      if (materialId === 0) continue;

      const mat = materials[materialId];
      let color = [...mat.color];

      // Fire flicker
      if (materialId === 5) {
        const intensity = life[idx] / 80;
        color = [
          255,
          Math.floor(100 + 155 * intensity),
          Math.floor(50 * intensity)
        ];
      }

      for (let dx = 0; dx < CELL_SIZE; dx++) {
        for (let dy = 0; dy < CELL_SIZE; dy++) {
          const px = (y * CELL_SIZE + dy) * canvas.width + (x * CELL_SIZE + dx);
          const i = px * 4;
          data[i] = color[0];
          data[i + 1] = color[1];
          data[i + 2] = color[2];
          data[i + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function loop() {
  if (!isPaused) updatePhysics();
  render();
  requestAnimationFrame(loop);
}

loop();
