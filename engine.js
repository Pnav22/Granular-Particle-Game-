const CELL_SIZE = 2;
const GRID_WIDTH = 400;
const GRID_HEIGHT = 300;

let grid = new Array(GRID_WIDTH * GRID_HEIGHT).fill(0);

function getIndex(x, y) {
  return y * GRID_WIDTH + x;
}

function isValid(x, y) {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

function swap(x1, y1, x2, y2) {
  const i1 = getIndex(x1, y1);
  const i2 = getIndex(x2, y2);
  [grid[i1], grid[i2]] = [grid[i2], grid[i1]];
}

function updatePhysics() {
  for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const idx = getIndex(x, y);
      const material = grid[idx];
      if (material === 0) continue;

      const below = getIndex(x, y + 1);
      if (isValid(x, y + 1) && grid[below] === 0) {
        swap(x, y, x, y + 1);
      } else if (materials[material].liquid) {
        const left = getIndex(x - 1, y);
        const right = getIndex(x + 1, y);
        if (isValid(x - 1, y) && grid[left] === 0) swap(x, y, x - 1, y);
        else if (isValid(x + 1, y) && grid[right] === 0) swap(x, y, x + 1, y);
      }
    }
  }
}
