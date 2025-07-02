// Shared state arrays
let grid = new Uint8Array(GRID_WIDTH * GRID_HEIGHT);
let life = new Uint16Array(GRID_WIDTH * GRID_HEIGHT);

function getIndex(x, y) {
  return y * GRID_WIDTH + x;
}

function isValid(x, y) {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

function getCell(x, y) {
  if (!isValid(x, y)) return 3; // Stone boundary outside
  return grid[getIndex(x, y)];
}

function setCell(x, y, material) {
  if (!isValid(x, y)) return;
  grid[getIndex(x, y)] = material;
}

function swapCells(x1, y1, x2, y2) {
  if (!isValid(x1, y1) || !isValid(x2, y2)) return;
  const idx1 = getIndex(x1, y1);
  const idx2 = getIndex(x2, y2);

  [grid[idx1], grid[idx2]] = [grid[idx2], grid[idx1]];
  [life[idx1], life[idx2]] = [life[idx2], life[idx1]];
}

function updatePhysics() {
  // We'll update bottom-to-top to simulate gravity better
  for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const idx = getIndex(x, y);
      const materialId = grid[idx];
      if (materialId === 0) continue;

      const mat = materials[materialId];

      // Fire logic
      if (materialId === 5) {
        life[idx]--;
        if (life[idx] <= 0) {
          grid[idx] = 0; // fire disappears
          continue;
        }
        // Fire tries to spread to flammable neighbors
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            if (!isValid(nx, ny)) continue;
            const nidx = getIndex(nx, ny);
            const nmat = materials[grid[nidx]];
            if (nmat.flammable && Math.random() < 0.05) {
              grid[nidx] = 5;
              life[nidx] = 40 + Math.floor(Math.random() * 40);
            }
          }
        }
        // Fire moves randomly upwards
        if (Math.random() < 0.7) {
          const moveX = x + (Math.random() < 0.5 ? -1 : 1);
          const moveY = y - 1;
          if (isValid(moveX, moveY) && grid[getIndex(moveX, moveY)] === 0) {
            swapCells(x, y, moveX, moveY);
          }
        }
        continue;
      }

      // Gravity and flow for liquids and powders
      const below = getCell(x, y + 1);
      if (below === 0 || (materials[below].density < mat.density)) {
        swapCells(x, y, x, y + 1);
        continue;
      }

      // Liquids flow sideways if can't fall down
      if (mat.liquid) {
        const dirs = [1, -1];
        for (const dir of dirs) {
          const side = getCell(x + dir, y);
          const diag = getCell(x + dir, y + 1);
          if (side === 0) {
            swapCells(x, y, x + dir, y);
            break;
          } else if ((diag === 0 || materials[diag].density < mat.density) && materials[side].density < mat.density) {
            swapCells(x, y, x + dir, y + 1);
            break;
          }
        }
      } else {
        // Powders try to fall diagonally if stuck
        const dirs = [1, -1];
        for (const dir of dirs) {
          if (getCell(x + dir, y + 1) === 0) {
            swapCells(x, y, x + dir, y + 1);
            break;
          }
        }
      }
    }
  }
}
