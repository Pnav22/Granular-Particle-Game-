const CELL_SIZE = 2;
const GRID_WIDTH = 400;  // 800 / 2
const GRID_HEIGHT = 300; // 600 / 2

// Materials definition with color, density, flammability, liquid, etc.
const materials = {
  0: { name: 'empty', color: [0, 0, 0], density: 0, flammable: false, burns: false, liquid: false },
  1: { name: 'sand', color: [238, 203, 173], density: 3, flammable: false, burns: false, liquid: false },
  2: { name: 'water', color: [64, 164, 223], density: 1, flammable: false, burns: false, liquid: true },
  3: { name: 'stone', color: [128, 128, 128], density: 5, flammable: false, burns: false, liquid: false },
  4: { name: 'oil', color: [139, 69, 19], density: 0.8, flammable: true, burns: false, liquid: true },
  5: { name: 'fire', color: [255, 100, 0], density: 0, flammable: false, burns: true, liquid: false }
};
